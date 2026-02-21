import { initTRPC } from '@trpc/server';
import { transformer } from '../shared/transformer';
import { Context } from './context';
import { context, reddit, redis } from '@devvit/web/server';
import { countDecrement, countGet, countIncrement } from './core/count';
import { z } from 'zod';
import type { PlayerProgress, SaveProgressInput, SaveProgressOutput } from '../shared/game';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

// Redis key for player progress
const PROGRESS_KEY_PREFIX = 'fengshui:progress:';

/**
 * 获取玩家进度
 */
async function getProgress(): Promise<PlayerProgress> {
  const username = await reddit.getCurrentUsername();
  if (!username) {
    return {
      completedLevels: [],
      currentLevelId: null,
      lastPlayedAt: 0,
    };
  }

  const key = `${PROGRESS_KEY_PREFIX}${username}`;
  const data = await redis.get(key);

  if (!data) {
    return {
      completedLevels: [],
      currentLevelId: null,
      lastPlayedAt: 0,
    };
  }

  try {
    return JSON.parse(data) as PlayerProgress;
  } catch {
    return {
      completedLevels: [],
      currentLevelId: null,
      lastPlayedAt: 0,
    };
  }
}

/**
 * 保存玩家进度
 */
async function saveProgress(input: SaveProgressInput): Promise<SaveProgressOutput> {
  const username = await reddit.getCurrentUsername();
  if (!username) {
    return {
      success: false,
      progress: {
        completedLevels: [],
        currentLevelId: null,
        lastPlayedAt: 0,
      },
    };
  }

  const key = `${PROGRESS_KEY_PREFIX}${username}`;
  const currentProgress = await getProgress();

  let completedLevels = currentProgress.completedLevels;
  if (input.completed && !completedLevels.includes(input.levelId)) {
    completedLevels = [...completedLevels, input.levelId];
  }

  const newProgress: PlayerProgress = {
    completedLevels,
    currentLevelId: input.levelId,
    lastPlayedAt: Date.now(),
  };

  await redis.set(key, JSON.stringify(newProgress));

  return {
    success: true,
    progress: newProgress,
  };
}

export const appRouter = t.router({
  init: t.router({
    get: publicProcedure.query(async () => {
      const [count, username, progress] = await Promise.all([
        countGet(),
        reddit.getCurrentUsername(),
        getProgress(),
      ]);

      return {
        count,
        postId: context.postId,
        username,
        progress,
      };
    }),
  }),
  counter: t.router({
    increment: publicProcedure
      .input(z.number().optional())
      .mutation(async ({ input }) => {
        const { postId } = context;
        return {
          count: await countIncrement(input),
          postId,
          type: 'increment',
        };
      }),
    decrement: publicProcedure
      .input(z.number().optional())
      .mutation(async ({ input }) => {
        const { postId } = context;
        return {
          count: await countDecrement(input),
          postId,
          type: 'decrement',
        };
      }),
    get: publicProcedure.query(async () => {
      return await countGet();
    }),
  }),
  progress: t.router({
    get: publicProcedure.query(async () => {
      return await getProgress();
    }),
    save: publicProcedure
      .input(z.object({
        levelId: z.string(),
        completed: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        return await saveProgress(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;