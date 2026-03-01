import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { db } from "./db";
import { games, tournaments } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // 1. Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // 2. Games API
  app.get(api.games.list.path, async (req, res) => {
    const allGames = await storage.getGames();
    res.json(allGames);
  });

  // 3. Teams API
  app.get(api.teams.list.path, async (req, res) => {
    const allTeams = await storage.getTeams();
    res.json(allTeams);
  });

  app.get(api.teams.get.path, async (req, res) => {
    const team = await storage.getTeam(Number(req.params.id));
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  });

  app.get(api.teams.myTeams.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const userTeams = await storage.getTeamsByUser(userId);
    res.json(userTeams);
  });

  app.post(api.teams.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.teams.create.input.parse(req.body);
      const team = await storage.createTeam(input, userId);
      res.status(201).json(team);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // 4. Tournaments API
  app.get(api.tournaments.list.path, async (req, res) => {
    const allTournaments = await storage.getTournaments();
    res.json(allTournaments);
  });

  app.get(api.tournaments.get.path, async (req, res) => {
    const t = await storage.getTournament(Number(req.params.id));
    if (!t) return res.status(404).json({ message: "Tournament not found" });
    res.json(t);
  });

  app.post(api.tournaments.register.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.tournaments.register.input.parse(req.body);
      await storage.registerTeamForTournament(Number(req.params.id), input.teamId);
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Failed to register" });
    }
  });

  // 5. Profiles API
  app.get(api.profiles.me.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const profile = await storage.getPlayerProfile(userId);
    res.json(profile || null);
  });

  app.post(api.profiles.createOrUpdate.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.profiles.createOrUpdate.input.parse(req.body);
      const profile = await storage.upsertPlayerProfile(userId, input);
      res.json(profile);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });

  app.get(api.profiles.leaderboard.path, async (req, res) => {
    const leaders = await storage.getLeaderboard();
    res.json(leaders);
  });

  // 6. Challenges API
  app.get(api.challenges.myChallenges.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const userChallenges = await storage.getChallenges(userId);
    res.json(userChallenges);
  });

  app.post(api.challenges.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.challenges.create.input.parse(req.body);
      const challenge = await storage.createChallenge(input, userId);
      res.status(201).json(challenge);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });


  // Seed initial games and tournaments
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingGames = await storage.getGames();
  if (existingGames.length === 0) {
    const newGames = await db.insert(games).values([
      { name: "bgmi", displayName: "BGMI", imageUrl: "/images/bgmi.png" },
      { name: "valorant", displayName: "Valorant", imageUrl: "/images/valorant.png" },
      { name: "freefire", displayName: "Free Fire", imageUrl: "/images/freefire.webp" }
    ]).returning();

    // Create some initial tournaments
    const bgmiId = newGames.find(g => g.name === 'bgmi')?.id;
    const valId = newGames.find(g => g.name === 'valorant')?.id;

    if (bgmiId && valId) {
      await db.insert(tournaments).values([
        {
          name: "Kill the Boss / Qual#1",
          gameId: bgmiId,
          status: "registration_opened",
          startDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
          jackpot: 30000,
          maxTeams: 100,
          description: "Monthly BGMI qualifier tournament with huge prize pool!"
        },
        {
          name: "Leader Cup #7",
          gameId: valId,
          status: "registration_opened",
          startDate: new Date(Date.now() + 86400000 * 5),
          jackpot: 50000,
          maxTeams: 64,
          description: "Top tier Valorant showdown."
        },
        {
          name: "Heatrow's Cup",
          gameId: valId,
          status: "upcoming",
          startDate: new Date(Date.now() + 86400000 * 10),
          jackpot: 15000,
          maxTeams: 32,
          description: "Weekly amateur cup."
        }
      ]);
    }
  }
}
