import { sql } from "drizzle-orm";
import { pgTable, text, serial, integer, boolean, timestamp, varchar, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth";
import { users } from "./models/auth";

// System Settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  appName: text("app_name").notNull().default("Battleroof"),
  contactEmail: text("contact_email"),
  maintenanceMode: boolean("maintenance_mode").default(false),
});

// Games
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g. "bgmi", "freefire", "valorant"
  displayName: text("display_name").notNull(),
  imageUrl: text("image_url"),
  bannerUrl: text("banner_url"),
});

// Teams
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  captainId: varchar("captain_id").references(() => users.id).notNull(),
  logoUrl: text("logo_url"),
  elo: integer("elo").default(1000),
  isBlocked: boolean("is_blocked").default(false),
  type: text("type").notNull().default("squad"), // "solo", "duo", "squad"
  createdAt: timestamp("created_at").defaultNow(),
});

// Team Members
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: text("role").notNull().default("player"), // "captain", "player"
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Tournaments
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  status: text("status").notNull().default("upcoming"), // "upcoming", "registration_opened", "published", "finished"
  type: text("type").notNull().default("tournament"), // "tournament", "scrim", "matchmaking"
  startDate: timestamp("start_date").notNull(),
  jackpot: integer("jackpot").notNull().default(0),
  maxTeams: integer("max_teams").notNull(),
  registeredTeamsCount: integer("registered_teams_count").default(0),
  description: text("description"),
  roomId: text("room_id"),
  roomPassword: text("room_password"),
  isFeatured: boolean("is_featured").default(false),
});

// Tournament Registrations
export const tournamentRegistrations = pgTable("tournament_registrations", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
});

// Challenges
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  challengerId: varchar("challenger_id").references(() => users.id).notNull(),
  challengedId: varchar("challenged_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("pending"), 
  createdAt: timestamp("created_at").defaultNow(),
  wager: integer("wager").default(0),
});

// User Profiles
export const playerProfiles = pgTable("player_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  inGameName: text("in_game_name").notNull(),
  rank: text("rank"),
  level: integer("level").default(1),
  matchesPlayed: integer("matches_played").default(0),
  elo: integer("elo").default(1000),
  winnings: integer("winnings").default(0),
  subscriptionTier: text("subscription_tier").default("free"), // "free", "pro", "elite"
  isBlocked: boolean("is_blocked").default(false),
  isAdmin: boolean("is_admin").default(false),
});

// Giveaways
export const giveaways = pgTable("giveaways", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  endsAt: timestamp("ends_at").notNull(),
  prize: text("prize").notNull(),
  isActive: boolean("is_active").default(true),
});

// === RELATIONS ===
export const teamsRelations = relations(teams, ({ one, many }) => ({
  game: one(games, { fields: [teams.gameId], references: [games.id] }),
  captain: one(users, { fields: [teams.captainId], references: [users.id] }),
  members: many(teamMembers),
  registrations: many(tournamentRegistrations),
}));

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  game: one(games, { fields: [tournaments.gameId], references: [games.id] }),
  registrations: many(tournamentRegistrations),
}));

export const userRelations = relations(users, ({ many, one }) => ({
  teamsCaptain: many(teams),
  teamMemberships: many(teamMembers),
  profiles: many(playerProfiles),
}));

// === SCHEMAS ===
export const insertGameSchema = createInsertSchema(games).omit({ id: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true, elo: true, captainId: true, isBlocked: true });
export const insertTournamentSchema = createInsertSchema(tournaments).omit({ id: true, registeredTeamsCount: true });
export const insertPlayerProfileSchema = createInsertSchema(playerProfiles).omit({ id: true, userId: true, elo: true, winnings: true, isBlocked: true, isAdmin: true });
export const insertChallengeSchema = createInsertSchema(challenges).omit({ id: true, createdAt: true, status: true, challengerId: true });
export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });

// === TYPES ===
export type Game = typeof games.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type TournamentRegistration = typeof tournamentRegistrations.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type PlayerProfile = typeof playerProfiles.$inferSelect;
export type Settings = typeof settings.$inferSelect;
export type Giveaway = typeof giveaways.$inferSelect;

export type CreateTeamRequest = z.infer<typeof insertTeamSchema>;
export type CreateTournamentRequest = z.infer<typeof insertTournamentSchema>;
export type CreatePlayerProfileRequest = z.infer<typeof insertPlayerProfileSchema>;
export type CreateChallengeRequest = z.infer<typeof insertChallengeSchema>;
