import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";
import { storage } from "../../storage";
import { db } from "../../db";
import { localAccounts } from "@shared/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && process.env.LOCAL_AUTH !== "true",
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

function hashPassword(password: string) {
  const salt = process.env.LOCAL_AUTH_SALT || "local-auth-salt";
  return crypto.createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

async function ensureAdminAccount() {
  const adminUsername = "admin";
  const existing = await db.select().from(localAccounts).where(eq(localAccounts.username, adminUsername));
  if (existing.length > 0) return;

  const adminUserId = "local-admin";
  await authStorage.upsertUser({
    id: adminUserId,
    email: "admin@local",
    firstName: "Admin",
    lastName: "User",
    profileImageUrl: null,
  });

  await db.insert(localAccounts).values({
    userId: adminUserId,
    username: adminUsername,
    passwordHash: hashPassword("admin"),
    role: "admin",
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const isLocalAuth = process.env.LOCAL_AUTH === "true";
  if (isLocalAuth) {
    await ensureAdminAccount();

    app.post("/api/player/register", async (req, res) => {
      const username = String(req.body?.username || "").trim();
      const password = String(req.body?.password || "");
      const inGameName = String(req.body?.inGameName || username).trim();

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const existing = await db.select().from(localAccounts).where(eq(localAccounts.username, username));
      if (existing.length > 0) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const userId = `local-${username}`;
      const user = await authStorage.upsertUser({
        id: userId,
        email: `${username}@local`,
        firstName: username,
        lastName: "Player",
        profileImageUrl: null,
      });

      await db.insert(localAccounts).values({
        userId,
        username,
        passwordHash: hashPassword(password),
        role: "player",
      });

      await storage.upsertPlayerProfile(userId, {
        inGameName: inGameName || username,
        gameId: 1,
        rank: "Bronze",
        level: 1,
        matchesPlayed: 0,
        subscriptionTier: "free",
      });

      const sessionData = req.session as any;
      sessionData.localUserId = userId;
      sessionData.localRole = "player";

      return res.json({ ok: true, user });
    });

    app.post("/api/player/login", async (req, res) => {
      const username = String(req.body?.username || "").trim();
      const password = String(req.body?.password || "");
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const [account] = await db.select().from(localAccounts).where(eq(localAccounts.username, username));
      if (!account || account.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = await authStorage.getUser(account.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const sessionData = req.session as any;
      sessionData.localUserId = account.userId;
      sessionData.localRole = account.role;

      return res.json({ ok: true, user });
    });

    app.post("/api/admin/login", async (req, res) => {
      const username = String(req.body?.username || "").trim();
      const password = String(req.body?.password || "");

      const [account] = await db.select().from(localAccounts).where(eq(localAccounts.username, username));
      if (!account || account.role !== "admin" || account.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      const profile = await storage.upsertPlayerProfile(account.userId, {
        inGameName: "Admin",
        gameId: 1,
        rank: "Bronze",
        level: 1,
        matchesPlayed: 0,
        subscriptionTier: "free",
      });
      await storage.updateProfile(profile.id, { isAdmin: true });

      const sessionData = req.session as any;
      sessionData.localUserId = account.userId;
      sessionData.localRole = "admin";

      return res.json({ ok: true });
    });

    app.post("/api/logout", (req, res) => {
      const sessionData = req.session as any;
      if (sessionData) {
        sessionData.localUserId = null;
        sessionData.localRole = null;
      }
      res.json({ ok: true });
    });

    return;
  }

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Keep track of registered strategies
  const registeredStrategies = new Set<string>();

  // Helper function to ensure strategy exists for a domain
  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (process.env.LOCAL_AUTH === "true") {
    const sessionData = (req.session as any) || {};
    if (sessionData.localUserId) {
      const role = sessionData.localRole === "admin" ? "admin" : "player";
      req.user = {
        claims: {
          sub: sessionData.localUserId,
          email: `${sessionData.localUserId}@local`,
          first_name: role === "admin" ? "Admin" : "Player",
          last_name: "Dev",
          profile_image_url: null,
        },
        access_token: "dev",
        refresh_token: null,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      } as any;
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
