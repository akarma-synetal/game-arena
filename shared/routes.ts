import { z } from 'zod';
import { 
  insertTeamSchema, 
  insertTournamentSchema, 
  insertPlayerProfileSchema,
  insertChallengeSchema,
  insertSettingsSchema
} from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  settings: {
    get: { method: 'GET' as const, path: '/api/settings' as const, responses: { 200: z.any() } },
    update: { method: 'POST' as const, path: '/api/settings' as const, input: insertSettingsSchema.partial(), responses: { 200: z.any() } }
  },
  games: {
    list: { method: 'GET' as const, path: '/api/games' as const, responses: { 200: z.array(z.any()) } }
  },
  teams: {
    list: { method: 'GET' as const, path: '/api/teams' as const, responses: { 200: z.array(z.any()) } },
    get: { method: 'GET' as const, path: '/api/teams/:id' as const, responses: { 200: z.any(), 404: errorSchemas.notFound } },
    create: { method: 'POST' as const, path: '/api/teams' as const, input: insertTeamSchema, responses: { 201: z.any() } },
    update: { method: 'PATCH' as const, path: '/api/teams/:id' as const, input: z.any(), responses: { 200: z.any() } },
    myTeams: { method: 'GET' as const, path: '/api/teams/me' as const, responses: { 200: z.array(z.any()) } }
  },
  tournaments: {
    list: { method: 'GET' as const, path: '/api/tournaments' as const, responses: { 200: z.array(z.any()) } },
    get: { method: 'GET' as const, path: '/api/tournaments/:id' as const, responses: { 200: z.any() } },
    create: { method: 'POST' as const, path: '/api/tournaments' as const, input: insertTournamentSchema, responses: { 201: z.any() } },
    update: { method: 'PATCH' as const, path: '/api/tournaments/:id' as const, input: z.any(), responses: { 200: z.any() } },
    register: { method: 'POST' as const, path: '/api/tournaments/:id/register' as const, input: z.object({ teamId: z.number() }), responses: { 200: z.any() } }
  },
  profiles: {
    me: { method: 'GET' as const, path: '/api/profiles/me' as const, responses: { 200: z.any() } },
    all: { method: 'GET' as const, path: '/api/profiles' as const, responses: { 200: z.array(z.any()) } },
    update: { method: 'PATCH' as const, path: '/api/profiles/:id' as const, input: z.any(), responses: { 200: z.any() } },
    createOrUpdate: { method: 'POST' as const, path: '/api/profiles' as const, input: insertPlayerProfileSchema, responses: { 200: z.any() } },
    leaderboard: { method: 'GET' as const, path: '/api/leaderboard' as const, responses: { 200: z.array(z.any()) } }
  },
  challenges: {
    create: { method: 'POST' as const, path: '/api/challenges' as const, input: insertChallengeSchema, responses: { 201: z.any() } },
    myChallenges: { method: 'GET' as const, path: '/api/challenges/me' as const, responses: { 200: z.array(z.any()) } }
  },
  giveaways: {
    list: { method: 'GET' as const, path: '/api/giveaways' as const, responses: { 200: z.array(z.any()) } }
  },
  admin: {
    users: { method: 'GET' as const, path: '/api/admin/users' as const, responses: { 200: z.array(z.any()) } }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
