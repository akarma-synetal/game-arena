import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { db } from "./db";
import { localAccounts } from "@shared/schema";
import { seedAllDummyData } from "./seed";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  const isAdmin = async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const profile = await storage.getPlayerProfile(req.user.claims.sub);
    if (!profile?.isAdmin) return res.status(403).json({ message: "Forbidden" });
    next();
  };

  app.get(api.settings.get.path, async (req, res) => res.json(await storage.getSettings()));
  app.post(api.settings.update.path, isAdmin, async (req, res) => res.json(await storage.updateSettings(req.body)));

  app.get(api.games.list.path, async (req, res) => res.json(await storage.getGames()));

  app.get(api.teams.list.path, async (req, res) => res.json(await storage.getTeams()));
  app.get(api.teams.myTeams.path, isAuthenticated, async (req: any, res) => res.json(await storage.getTeamsByUser(req.user.claims.sub)));
  app.post(api.teams.create.path, isAuthenticated, async (req: any, res) => res.status(201).json(await storage.createTeam(req.body, req.user.claims.sub)));
  app.patch(api.teams.update.path, isAdmin, async (req, res) => res.json(await storage.updateTeam(Number(req.params.id), req.body)));

  app.get(api.tournaments.list.path, async (req, res) => res.json(await storage.getTournaments()));
  app.get(api.tournaments.get.path, async (req, res) => res.json(await storage.getTournament(Number(req.params.id))));
  app.post(api.tournaments.create.path, isAdmin, async (req, res) => res.status(201).json(await storage.createTournament(req.body)));
  app.patch(api.tournaments.update.path, isAdmin, async (req, res) => res.json(await storage.updateTournament(Number(req.params.id), req.body)));
  app.post(api.tournaments.register.path, isAuthenticated, async (req, res) => {
    await storage.registerTeamForTournament(Number(req.params.id), req.body.teamId);
    res.json({ success: true });
  });

  app.get(api.profiles.me.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    let profile = await storage.getPlayerProfile(userId);
    if (!profile) {
      // Auto-create profile on first access
      profile = await storage.upsertPlayerProfile(userId, {
        inGameName: req.user.claims.first_name || "Operative",
        gameId: 1, // Default game
        rank: "Bronze",
        level: 1,
        matchesPlayed: 0,
        subscriptionTier: "free"
      });
      // For demo: make the very first user an admin
      const allProfiles = await storage.getAllProfiles();
      if (allProfiles.length === 1) {
        await storage.updateProfile(profile.id, { isAdmin: true });
        profile.isAdmin = true;
      }
    }
    res.json(profile);
  });
  
  app.get(api.profiles.all.path, isAdmin, async (req, res) => res.json(await storage.getAllProfiles()));
  app.patch(api.profiles.update.path, isAdmin, async (req, res) => res.json(await storage.updateProfile(Number(req.params.id), req.body)));
  app.post(api.profiles.createOrUpdate.path, isAuthenticated, async (req: any, res) => res.json(await storage.upsertPlayerProfile(req.user.claims.sub, req.body)));
  app.get(api.profiles.leaderboard.path, async (req, res) => res.json(await storage.getLeaderboard()));

  app.get(api.challenges.myChallenges.path, isAuthenticated, async (req: any, res) => res.json(await storage.getChallenges(req.user.claims.sub)));
  app.post(api.challenges.create.path, isAuthenticated, async (req: any, res) => res.status(201).json(await storage.createChallenge(req.body, req.user.claims.sub)));

  app.get(api.giveaways.list.path, async (req, res) => res.json(await storage.getGiveaways()));
  app.get(api.admin.users.path, isAdmin, async (req, res) => res.json(await storage.getAllUsers()));
  app.get("/api/admin/accounts", isAdmin, async (req, res) => res.json(await db.select().from(localAccounts)));

  await seedAllDummyData();
  return httpServer;
}
