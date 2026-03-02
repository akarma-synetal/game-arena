import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  challenges,
  games,
  localAccounts,
  playerProfiles,
  settings,
  teamMembers,
  teams,
  tournamentRegistrations,
  tournaments,
} from "@shared/schema";
import { users } from "@shared/models/auth";

function hashPassword(password: string) {
  const salt = process.env.LOCAL_AUTH_SALT || "local-auth-salt";
  return crypto.createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function ensureAccount(opts: {
  userId: string;
  username: string;
  role: "admin" | "partner" | "player";
  firstName: string;
  lastName: string;
  email: string;
  inGameName: string;
  password: string;
  gameId: number;
  isAdmin?: boolean;
}) {
  await db.insert(users).values({
    id: opts.userId,
    email: opts.email,
    firstName: opts.firstName,
    lastName: opts.lastName,
    profileImageUrl: null,
  }).onConflictDoNothing();

  await db.insert(localAccounts).values({
    userId: opts.userId,
    username: opts.username,
    passwordHash: hashPassword(opts.password),
    role: opts.role,
  }).onConflictDoNothing();

  const [profile] = await db.select().from(playerProfiles).where(eq(playerProfiles.userId, opts.userId));
  if (!profile) {
    await db.insert(playerProfiles).values({
      userId: opts.userId,
      gameId: opts.gameId,
      inGameName: opts.inGameName,
      rank: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"][randomBetween(0, 4)],
      level: opts.role === "player" ? randomBetween(5, 85) : randomBetween(30, 100),
      matchesPlayed: opts.role === "player" ? randomBetween(10, 900) : randomBetween(50, 1200),
      elo: opts.role === "player" ? randomBetween(900, 2600) : randomBetween(1400, 2800),
      winnings: opts.role === "player" ? randomBetween(500, 300000) : randomBetween(5000, 500000),
      subscriptionTier: opts.role === "player"
        ? ["free", "pro", "elite"][randomBetween(0, 2)]
        : "elite",
      isBlocked: false,
      isAdmin: !!opts.isAdmin,
    });
  } else if (opts.isAdmin && !profile.isAdmin) {
    await db.update(playerProfiles).set({ isAdmin: true }).where(eq(playerProfiles.id, profile.id));
  }
}

export async function seedAllDummyData() {
  const localAuth = process.env.LOCAL_AUTH === "true";
  if (!localAuth) return;

  const [existingSettings] = await db.select().from(settings);
  if (!existingSettings) {
    await db.insert(settings).values({ appName: "Battleroof" });
  }

  const existingGames = await db.select().from(games);
  const requiredGames = [
    { name: "bgmi", displayName: "BGMI", imageUrl: "/images/bgmi.png", bannerUrl: "/images/bgmi.png" },
    { name: "freefire", displayName: "Free Fire", imageUrl: "/images/freefire.webp", bannerUrl: "/images/freefire.webp" },
    { name: "pubg", displayName: "PUBG", imageUrl: "/images/bgmi.png", bannerUrl: "/images/bgmi.png" },
  ];

  for (const requiredGame of requiredGames) {
    if (!existingGames.some((entry) => entry.name === requiredGame.name)) {
      await db.insert(games).values(requiredGame).onConflictDoNothing();
    }
  }

  const allGames = await db.select().from(games);
  const bgmi = allGames.find((game) => game.name === "bgmi") || allGames[0];
  const freefire = allGames.find((game) => game.name === "freefire") || allGames[0];
  const pubg = allGames.find((game) => game.name === "pubg") || allGames[0];
  const gameRotation = [bgmi.id, freefire.id, pubg.id];

  await ensureAccount({
    userId: "seed-admin-1",
    username: "admin",
    role: "admin",
    firstName: "Super",
    lastName: "Admin",
    email: "admin@battleroof.local",
    inGameName: "COMMAND",
    password: "admin",
    gameId: bgmi.id,
    isAdmin: true,
  });

  for (let index = 1; index <= 5; index++) {
    await ensureAccount({
      userId: `seed-partner-${index}`,
      username: `partner${index}`,
      role: "partner",
      firstName: `Partner${index}`,
      lastName: "Host",
      email: `partner${index}@battleroof.local`,
      inGameName: `HOST-${index}`,
      password: "partner",
      gameId: gameRotation[index % gameRotation.length],
    });
  }

  for (let index = 1; index <= 200; index++) {
    const serial = String(index).padStart(3, "0");
    await ensureAccount({
      userId: `seed-player-${serial}`,
      username: `player${serial}`,
      role: "player",
      firstName: `Player${serial}`,
      lastName: "Ops",
      email: `player${serial}@battleroof.local`,
      inGameName: `OP-${serial}`,
      password: "player",
      gameId: gameRotation[index % gameRotation.length],
    });
  }

  const playerAccounts = await db.select().from(localAccounts).where(eq(localAccounts.role, "player"));
  const teamTypes: Array<"solo" | "duo" | "squad"> = ["solo", "duo", "squad"];
  const existingTeams = await db.select().from(teams);

  for (let index = existingTeams.length; index < 50; index++) {
    const captain = playerAccounts[index % playerAccounts.length];
    const teamType = teamTypes[index % teamTypes.length];
    const [newTeam] = await db.insert(teams).values({
      name: `Strike-${String(index + 1).padStart(2, "0")}`,
      gameId: gameRotation[index % gameRotation.length],
      captainId: captain.userId,
      type: teamType,
      elo: randomBetween(900, 2100),
      isBlocked: false,
    }).returning();

    await db.insert(teamMembers).values({ teamId: newTeam.id, userId: captain.userId, role: "captain" }).onConflictDoNothing();

    const extraMembers = teamType === "solo" ? 0 : teamType === "duo" ? 1 : 3;
    for (let offset = 0; offset < extraMembers; offset++) {
      const member = playerAccounts[(index * 7 + offset + 1) % playerAccounts.length];
      await db.insert(teamMembers).values({ teamId: newTeam.id, userId: member.userId, role: "player" }).onConflictDoNothing();
    }
  }

  const allTeams = await db.select().from(teams);
  const existingTournaments = await db.select().from(tournaments);
  const statuses = ["upcoming", "registration_opened", "finished"] as const;

  for (let index = existingTournaments.length; index < 18; index++) {
    const status = statuses[index % statuses.length];
    const gameId = gameRotation[index % gameRotation.length];
    const maxTeams = [16, 24, 32, 48, 64][index % 5];
    const winnerTeam = allTeams[(index * 3) % allTeams.length];
    const baseDate = new Date();
    const startDate =
      status === "finished"
        ? new Date(baseDate.getTime() - (index + 2) * 86400000)
        : new Date(baseDate.getTime() + (index + 1) * 86400000);

    await db.insert(tournaments).values({
      name: `Arena Event ${String(index + 1).padStart(2, "0")}`,
      gameId,
      status,
      type: index % 2 === 0 ? "tournament" : "scrim",
      startDate,
      jackpot: randomBetween(2000, 150000),
      maxTeams,
      registeredTeamsCount: 0,
      description: status === "finished"
        ? `Completed event. Winner: ${winnerTeam?.name || "N/A"}`
        : "Upcoming competitive event.",
      roomId: status !== "upcoming" ? `ROOM-${1000 + index}` : null,
      roomPassword: status !== "upcoming" ? `PASS${2000 + index}` : null,
      isFeatured: index % 4 === 0,
    });
  }

  const allTournaments = await db.select().from(tournaments);
  for (const tournament of allTournaments) {
    const existingRegs = await db
      .select()
      .from(tournamentRegistrations)
      .where(eq(tournamentRegistrations.tournamentId, tournament.id));

    const targetRegistrations = Math.min(
      tournament.maxTeams,
      tournament.status === "finished" ? randomBetween(10, 20) : randomBetween(8, 16),
    );

    for (let index = existingRegs.length; index < targetRegistrations; index++) {
      const selectedTeam = allTeams[(tournament.id + index) % allTeams.length];
      await db.insert(tournamentRegistrations).values({
        tournamentId: tournament.id,
        teamId: selectedTeam.id,
      });
    }

    await db.update(tournaments)
      .set({ registeredTeamsCount: targetRegistrations })
      .where(eq(tournaments.id, tournament.id));
  }

  const existingChallenges = await db.select().from(challenges);
  const players = playerAccounts.map((account) => account.userId);
  for (let index = existingChallenges.length; index < 120; index++) {
    const challenger = players[index % players.length];
    let challenged = players[(index * 5 + 11) % players.length];
    if (challenger === challenged) {
      challenged = players[(index * 7 + 3) % players.length];
    }
    await db.insert(challenges).values({
      gameId: gameRotation[index % gameRotation.length],
      challengerId: challenger,
      challengedId: challenged,
      status: ["pending", "accepted", "completed"][index % 3],
      wager: randomBetween(100, 5000),
    });
  }
}
