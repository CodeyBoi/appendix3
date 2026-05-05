import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { filterNone } from 'utils/array';

export const gamesRouter = router({
  startSetSession: protectedProcedure.mutation(async ({ ctx }) => {
    const corpsId = ctx.session.user.corps.id;
    const res = await ctx.prisma.setSession.create({
      data: {
        corps: {
          connect: {
            id: corpsId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    return res;
  }),

  endSetSession: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const end = new Date();

      const session = await ctx.prisma.setSession.findUnique({
        where: {
          id,
        },
      });

      if (!session) {
        throw new Error(`Set game session with id ${id} could not be found`);
      }

      const res = await ctx.prisma.setSession.update({
        where: {
          id,
        },
        data: {
          endedAt: end,
          durationInMillis: end.getTime() - session.startedAt.getTime(),
        },
      });
      return res;
    }),

  getSetHighscore: protectedProcedure
    .input(z.object({ corpsId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { corpsId } = input;
      const res = await ctx.prisma.setSession.findFirst({
        include: {
          corps: true,
        },
        where: {
          corps: {
            id: corpsId,
          },
        },
        orderBy: {
          durationInMillis: 'asc',
        },
      });
      return res;
    }),

  getSetHighscores: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.setSession.groupBy({
      by: 'corpsId',
      _min: {
        durationInMillis: true,
      },
      orderBy: {
        _min: {
          durationInMillis: 'asc',
        },
      },
      take: 50,
    });
    const withCorps = await Promise.all(
      res.map(async (session) => {
        if (!session._min.durationInMillis) {
          return null;
        }
        return {
          corps: await ctx.prisma.corps.findUniqueOrThrow({
            where: { id: session.corpsId },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              number: true,
              bNumber: true,
              nickName: true,
            },
          }),
          durationInMillis: session._min.durationInMillis,
        };
      }),
    );
    return filterNone(withCorps);
  }),

  getJoinableBotcSessions: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.botcSession.groupBy({
      by: ['storytellerId'],
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
      where: {
        hasStarted: false,
      },
    });

    const withCorps = await Promise.all(
      res.map(async (session) => {
        return {
          corps: await ctx.prisma.corps.findUniqueOrThrow({
            where: { id: session.storytellerId },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              number: true,
              bNumber: true,
              nickName: true,
            },
          }),
        };
      }),
    );

    return withCorps;
  }),

  createBotcSession: protectedProcedure
    .input(
      z.object({
        scriptCharacters: z.array(z.string()),
        corpsIds: z.array(z.string().cuid()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { scriptCharacters, corpsIds = [] } = input;
      const corpsId = ctx.session.user.corps.id;

      const res = ctx.prisma.botcSession.create({
        data: {
          script: scriptCharacters.join(','),
          players: {
            createMany: {
              data: corpsIds.map((corpsId) => ({
                corpsId,
              })),
            },
          },
          storyteller: {
            connect: {
              id: corpsId,
            },
          },
        },
      });

      return res;
    }),
});
