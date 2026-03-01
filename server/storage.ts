import { db } from "./db";
import { 
  games, teams, teamMembers, tournaments, tournamentRegistrations, challenges, playerProfiles,
  type Game, type Team, type Tournament, type PlayerProfile, type Challenge,
  type CreateTeamRequest, type CreateTournamentRequest, type CreatePlayerProfileRequest, type CreateChallengeRequest
} from "@shared/schema";
import { eq, or, and, desc } from "drizzle-orm";

export interface IStorage {
  // Games
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  getTeamsByUser(userId: string): Promise<Team[]>;
  createTeam(team: CreateTeamRequest, captainId: string): Promise<Team>;

  // Tournaments
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  registerTeamForTournament(tournamentId: number, teamId: number): Promise<void>;

  // Profiles
  getPlayerProfile(userId: string): Promise<PlayerProfile | undefined>;
  upsertPlayerProfile(userId: string, profile: CreatePlayerProfileRequest): Promise<PlayerProfile>;
  getLeaderboard(): Promise<PlayerProfile[]>;

  // Challenges
  getChallenges(userId: string): Promise<Challenge[]>;
  createChallenge(challenge: CreateChallengeRequest, challengerId: string): Promise<Challenge>;
}

export class DatabaseStorage implements IStorage {
  // Games
  async getGames(): Promise<Game[]> {
    return await db.select().from(games);
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getTeamsByUser(userId: string): Promise<Team[]> {
    // Return teams where user is either captain or a member
    const userTeams = await db.select().from(teams)
      .leftJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .where(or(
        eq(teams.captainId, userId),
        eq(teamMembers.userId, userId)
      ));
    
    // Deduplicate and map
    const uniqueTeams = new Map<number, Team>();
    for (const row of userTeams) {
      if (row.teams) {
        uniqueTeams.set(row.teams.id, row.teams);
      }
    }
    return Array.from(uniqueTeams.values());
  }

  async createTeam(teamData: CreateTeamRequest, captainId: string): Promise<Team> {
    const [team] = await db.insert(teams).values({
      ...teamData,
      captainId,
    }).returning();

    // Add captain as a team member
    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: captainId,
      role: 'captain'
    });

    return team;
  }

  // Tournaments
  async getTournaments(): Promise<Tournament[]> {
    return await db.select().from(tournaments).orderBy(desc(tournaments.startDate));
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async registerTeamForTournament(tournamentId: number, teamId: number): Promise<void> {
    await db.insert(tournamentRegistrations).values({
      tournamentId,
      teamId
    });
  }

  // Profiles
  async getPlayerProfile(userId: string): Promise<PlayerProfile | undefined> {
    const [profile] = await db.select().from(playerProfiles).where(eq(playerProfiles.userId, userId));
    return profile;
  }

  async upsertPlayerProfile(userId: string, profileData: CreatePlayerProfileRequest): Promise<PlayerProfile> {
    const existing = await this.getPlayerProfile(userId);
    if (existing) {
      const [updated] = await db.update(playerProfiles)
        .set(profileData)
        .where(eq(playerProfiles.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(playerProfiles)
        .values({ ...profileData, userId })
        .returning();
      return created;
    }
  }

  async getLeaderboard(): Promise<PlayerProfile[]> {
    return await db.select().from(playerProfiles).orderBy(desc(playerProfiles.elo)).limit(50);
  }

  // Challenges
  async getChallenges(userId: string): Promise<Challenge[]> {
    return await db.select().from(challenges)
      .where(or(
        eq(challenges.challengerId, userId),
        eq(challenges.challengedId, userId)
      ))
      .orderBy(desc(challenges.createdAt));
  }

  async createChallenge(challengeData: CreateChallengeRequest, challengerId: string): Promise<Challenge> {
    const [challenge] = await db.insert(challenges).values({
      ...challengeData,
      challengerId,
    }).returning();
    return challenge;
  }
}

export const storage = new DatabaseStorage();
