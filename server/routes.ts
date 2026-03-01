import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { db } from "./db";
import { games, tournaments, playerProfiles, teams, teamMembers, users, settings } from "@shared/schema";
import { eq } from "drizzle-orm";

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

  await seedDatabase();
  return httpServer;
}

async function seedDatabase() {
  const existingGames = await storage.getGames();
  if (existingGames.length === 0) {
    const newGames = await db.insert(games).values([
      { name: "bgmi", displayName: "BGMI", imageUrl: "/images/bgmi.png", bannerUrl: "/images/bgmi.png" },
      { name: "valorant", displayName: "Valorant", imageUrl: "/images/valorant.png", bannerUrl: "/images/valorant.png" },
      { name: "freefire", displayName: "Free Fire", imageUrl: "/images/freefire.webp", bannerUrl: "/images/freefire.webp" },
      { name: "cod", displayName: "COD Mobile", imageUrl: "/images/bgmi.png", bannerUrl: "/images/bgmi.png" }
    ]).returning();

    const bgmiId = newGames.find(g => g.name === 'bgmi')?.id;
    const valId = newGames.find(g => g.name === 'valorant')?.id;

    if (bgmiId && valId) {
      await db.insert(tournaments).values([
        { name: "Daily BGMI Scrim", gameId: bgmiId, type: "scrim", status: "registration_opened", startDate: new Date(), jackpot: 1000, maxTeams: 20 },
        { name: "Valorant Open Cup", gameId: valId, type: "tournament", status: "upcoming", startDate: new Date(Date.now() + 86400000), jackpot: 25000, maxTeams: 64, isFeatured: true },
        { name: "Free Fire Giveaway Cup", gameId: newGames.find(g => g.name === 'freefire')!.id, type: "tournament", status: "registration_opened", startDate: new Date(Date.now() + 172800000), jackpot: 5000, maxTeams: 100 }
      ]);
    }
    
    await db.insert(settings).values({ appName: "Battleroof" });
  }
}
