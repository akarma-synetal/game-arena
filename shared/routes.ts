import { z } from 'zod';
import { 
  insertTeamSchema, 
  insertTournamentSchema, 
  insertPlayerProfileSchema,
  insertChallengeSchema
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  games: {
    list: {
      method: 'GET' as const,
      path: '/api/games' as const,
      responses: {
        200: z.array(z.any()), // Game type
      }
    }
  },
  teams: {
    list: {
      method: 'GET' as const,
      path: '/api/teams' as const,
      responses: {
        200: z.array(z.any()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/teams/:id' as const,
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/teams' as const,
      input: insertTeamSchema,
      responses: {
        201: z.any(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    myTeams: {
      method: 'GET' as const,
      path: '/api/teams/me' as const,
      responses: {
        200: z.array(z.any()),
        401: errorSchemas.unauthorized,
      }
    }
  },
  tournaments: {
    list: {
      method: 'GET' as const,
      path: '/api/tournaments' as const,
      responses: {
        200: z.array(z.any()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tournaments/:id' as const,
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/tournaments/:id/register' as const,
      input: z.object({ teamId: z.number() }),
      responses: {
        200: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    }
  },
  profiles: {
    me: {
      method: 'GET' as const,
      path: '/api/profiles/me' as const,
      responses: {
        200: z.array(z.any()),
        401: errorSchemas.unauthorized,
      }
    },
    createOrUpdate: {
      method: 'POST' as const,
      path: '/api/profiles' as const,
      input: insertPlayerProfileSchema,
      responses: {
        200: z.any(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    leaderboard: {
      method: 'GET' as const,
      path: '/api/leaderboard' as const,
      responses: {
        200: z.array(z.any())
      }
    }
  },
  challenges: {
    create: {
      method: 'POST' as const,
      path: '/api/challenges' as const,
      input: insertChallengeSchema,
      responses: {
        201: z.any(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    myChallenges: {
      method: 'GET' as const,
      path: '/api/challenges/me' as const,
      responses: {
        200: z.array(z.any()),
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
