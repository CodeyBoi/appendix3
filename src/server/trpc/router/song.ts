import { z } from 'zod';
import { protectedProcedure, restrictedProcedure, router } from '../trpc';
import dayjs from 'dayjs';

const decodeSongTitle = (encodedTitle: string) =>
  decodeURIComponent(encodedTitle).replaceAll('_', ' ');

export const songRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const [byId, byTitle] = await Promise.all([
        ctx.prisma.song.findUnique({
          where: {
            id,
          },
        }),
        ctx.prisma.song.findUnique({ where: { title: decodeSongTitle(id) } }),
      ]);
      return byId ?? byTitle;
    }),

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
        title: title.trim(),
        author: author.trim(),
        melody: melody.trim(),
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

  remove: restrictedProcedure('manageCorps')
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
        melody: true,
        author: true,
        views: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
    songs.sort((a, b) => a.title.localeCompare(b.title, 'sv'));
    return songs;
  }),

  increaseViewCount: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id = '' } = input;
      const res = await ctx.prisma.song.update({
        where: { id },
        data: {
          views: {
            increment: 1,
          },
        },
      });
      return res;
    }),

  pin: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id = '' } = input;
      const createdById = ctx.session.user.corps.id;

      // Check song exists
      const song = await ctx.prisma.song.findFirst({
        select: {
          id: true,
        },
        where: {
          id,
        },
      });

      if (!song) {
        throw new Error(`Tried to pin song with non-existing id: ${id}`);
      }

      // Song should be pinned for 3 minutes
      const endsAt = dayjs().add(3, 'minutes').toDate();

      const res = await ctx.prisma.pinnedSong.create({
        data: {
          endsAt,
          song: {
            connect: {
              id,
            },
          },
          createdBy: {
            connect: {
              id: createdById,
            },
          },
        },
      });
      return res;
    }),

  getPinned: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const songs = await ctx.prisma.song.findMany({
      where: {
        pins: {
          some: {
            endsAt: {
              gte: now,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        melody: true,
        author: true,
        views: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
    songs.sort((a, b) => a.title.localeCompare(b.title, 'sv'));
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
