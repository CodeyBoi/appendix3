import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const songRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.song.findUnique({
        where: {
          id,
        },
      });
    }),

  // upsert: adminProcedure
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string(),
        author: z.string(),
        melody: z.string(),
        lyrics: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, author, melody, lyrics } = input;
      const ownCorpsId = ctx.session.user.corps.id;
      const data = {
        title,
        author,
        melody,
        lyrics,
      };
      return await ctx.prisma.song.upsert({
        where: {
          id: id ?? '',
        },
        update: data,
        create: {
          ...data,
          createdByCorpsId: ownCorpsId,
        },
      });
    }),

  // remove: adminProcedure
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.song.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const songs = await ctx.prisma.song.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
    songs.sort((a, b) => a.title.localeCompare(b.title, 'sv-SE'));
    return songs;
  }),

  // infiniteScroll: protectedProcedure
  //   .input(
  //     z.object({
  //       cursor: z.string().optional(),
  //       limit: z.number().min(1).max(100).optional(),
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const { cursor, limit = 50 } = input;
  //     const items = await ctx.prisma.song.findMany({
  //       select: {
  //         id: true,
  //         title: true,
  //       },
  //       take: limit + 1,
  //       cursor: cursor ? { id: cursor } : undefined,
  //       orderBy: {
  //         title: 'asc',
  //       },
  //     });
  //     let nextCursor: typeof cursor | undefined = undefined;
  //     if (items.length > limit) {
  //       const nextItem = items.pop();
  //       nextCursor = nextItem?.id;
  //     }
  //     return {
  //       items,
  //       nextCursor,
  //     };
  //   }),
});
