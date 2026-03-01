import { db } from "./db";
import { 
  games, teams, teamMembers, tournaments, tournamentRegistrations, challenges, playerProfiles, settings, giveaways,
  type Game, type Team, type Tournament, type PlayerProfile, type Challenge, type Settings, type Giveaway,
  type CreateTeamRequest, type CreateTournamentRequest, type CreatePlayerProfileRequest, type CreateChallengeRequest
} from "@shared/schema";
import { eq, or, and, desc, sql } from "drizzle-orm";
import { users } from "@shared/models/auth";

export interface IStorage {
  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(updates: Partial<Settings>): Promise<Settings>;

  // Games
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  getTeamsByUser(userId: string): Promise<Team[]>;
  createTeam(team: CreateTeamRequest, captainId: string): Promise<Team>;
  updateTeam(id: number, updates: any): Promise<Team>;

  // Tournaments
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  registerTeamForTournament(tournamentId: number, teamId: number): Promise<void>;
  createTournament(tournament: CreateTournamentRequest): Promise<Tournament>;
  updateTournament(id: number, updates: any): Promise<Tournament>;

  // Profiles
  getPlayerProfile(userId: string): Promise<PlayerProfile | undefined>;
  upsertPlayerProfile(userId: string, profile: CreatePlayerProfileRequest): Promise<PlayerProfile>;
  getLeaderboard(): Promise<PlayerProfile[]>;
  getAllProfiles(): Promise<PlayerProfile[]>;
  updateProfile(id: number, updates: any): Promise<PlayerProfile>;

  // Challenges
  getChallenges(userId: string): Promise<Challenge[]>;
  createChallenge(challenge: CreateChallengeRequest, challengerId: string): Promise<Challenge>;

  // Giveaways
  getGiveaways(): Promise<Giveaway[]>;

  // Admin specific
  getAllUsers(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getSettings(): Promise<Settings> {
    const [s] = await db.select().from(settings);
    if (!s) {
      const [ns] = await db.insert(settings).values({ appName: "Battleroof" }).returning();
      return ns;
    }
    return s;
  }

  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    const s = await this.getSettings();
    const [updated] = await db.update(settings).set(updates).where(eq(settings.id, s.id)).returning();
    return updated;
  }

  async getGames(): Promise<Game[]> {
    return await db.select().from(games);
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getTeamsByUser(userId: string): Promise<Team[]> {
    const userTeams = await db.select().from(teams)
      .leftJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .where(or(eq(teams.captainId, userId), eq(teamMembers.userId, userId)));
    
    const uniqueTeams = new Map<number, Team>();
    for (const row of userTeams) {
      if (row.teams) uniqueTeams.set(row.teams.id, row.teams);
    }
    return Array.from(uniqueTeams.values());
  }

  async createTeam(teamData: CreateTeamRequest, captainId: string): Promise<Team> {
    const [team] = await db.insert(teams).values({ ...teamData, captainId }).returning();
    await db.insert(teamMembers).values({ teamId: team.id, userId: captainId, role: 'captain' });
    return team;
  }

  async updateTeam(id: number, updates: any): Promise<Team> {
    const [updated] = await db.update(teams).set(updates).where(eq(teams.id, id)).returning();
    return updated;
  }

  async getTournaments(): Promise<Tournament[]> {
    return await db.select().from(tournaments).orderBy(desc(tournaments.startDate));
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async registerTeamForTournament(tournamentId: number, teamId: number): Promise<void> {
    await db.insert(tournamentRegistrations).values({ tournamentId, teamId });
    await db.update(tournaments)
      .set({ registeredTeamsCount: sql`${tournaments.registeredTeamsCount} + 1` })
      .where(eq(tournaments.id, tournamentId));
  }

  async createTournament(tournamentData: CreateTournamentRequest): Promise<Tournament> {
    const [t] = await db.insert(tournaments).values(tournamentData).returning();
    return t;
  }

  async updateTournament(id: number, updates: any): Promise<Tournament> {
    const [updated] = await db.update(tournaments).set(updates).where(eq(tournaments.id, id)).returning();
    return updated;
  }

  async getPlayerProfile(userId: string): Promise<PlayerProfile | undefined> {
    const [profile] = await db.select().from(playerProfiles).where(eq(playerProfiles.userId, userId));
    return profile;
  }

  async upsertPlayerProfile(userId: string, profileData: CreatePlayerProfileRequest): Promise<PlayerProfile> {
    const existing = await this.getPlayerProfile(userId);
    if (existing) {
      const [updated] = await db.update(playerProfiles).set(profileData).where(eq(playerProfiles.userId, userId)).returning();
      return updated;
    } else {
      const [created] = await db.insert(playerProfiles).values({ ...profileData, userId }).returning();
      return created;
    }
  }

  async getLeaderboard(): Promise<PlayerProfile[]> {
    return await db.select().from(playerProfiles).orderBy(desc(playerProfiles.elo)).limit(50);
  }

  async getAllProfiles(): Promise<PlayerProfile[]> {
    return await db.select().from(playerProfiles);
  }

  async updateProfile(id: number, updates: any): Promise<PlayerProfile> {
    const [updated] = await db.update(playerProfiles).set(updates).where(eq(playerProfiles.id, id)).returning();
    return updated;
  }

  async getChallenges(userId: string): Promise<Challenge[]> {
    return await db.select().from(challenges)
      .where(or(eq(challenges.challengerId, userId), eq(challenges.challengedId, userId)))
      .orderBy(desc(challenges.createdAt));
  }

  async createChallenge(challengeData: CreateChallengeRequest, challengerId: string): Promise<Challenge> {
    const [challenge] = await db.insert(challenges).values({ ...challengeData, challengerId }).returning();
    return challenge;
  }

  async getGiveaways(): Promise<Giveaway[]> {
    return await db.select().from(giveaways).where(eq(giveaways.isActive, true));
  }

  async getAllUsers(): Promise<any[]> {
    return await db.select().from(users);
  }
}

export const storage = new DatabaseStorage();
