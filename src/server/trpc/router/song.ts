import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const songRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.song.findUnique({
        where: {
          id,
        },
      });
    }),

  infiniteScroll: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit = 50 } = input;
      const items = await ctx.prisma.song.findMany({
        select: {
          id: true,
          title: true,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          title: 'asc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
});
