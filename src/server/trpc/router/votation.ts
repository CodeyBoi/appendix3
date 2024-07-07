import { z } from 'zod';
import { protectedProcedure, restrictedProcedure, router } from '../trpc';

export const votationRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const res = await ctx.prisma.votation.findFirstOrThrow({
      where: {
        startsAt: {
          lte: now,
        },
        endsAt: {
          gte: now,
        },
      },
      include: {
        options: true,
      },
    });
    return res;
  }),

  vote: protectedProcedure
    .input(
      z.object({
        votationItemId: z.number().int(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const corpsId = ctx.session.user.corps.id;
      const { votationItemId } = input;

      // If there exists a votation containing both the item
      // being voted for AND an item the corps has already
      // voted for, corps has already voted in this votation
      // (first condition picks out the current votation,
      // and the second condition checks if corps has already
      // voted)
      const oldVote = await ctx.prisma.votation.findFirst({
        where: {
          options: {
            some: {
              votes: {
                some: {
                  votationItemId,
                },
              },
            },
          },
          AND: {
            options: {
              some: {
                votes: {
                  some: {
                    corpsId,
                  },
                },
              },
            },
          },
        },
      });

      if (oldVote) {
        throw new Error('Corps already voted in this votation');
      }

      const res = await ctx.prisma.vote.create({
        data: {
          corpsId,
          votationItemId,
        },
      });
      return res;
    }),

  lastResult: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const votation = await ctx.prisma.votation.findFirstOrThrow({
      include: {
        options: {
          include: {
            votes: true,
          },
        },
      },
      where: {
        endsAt: {
          lt: now,
        },
      },
      orderBy: {
        endsAt: 'desc',
      },
    });

    const votes = await ctx.prisma.vote.groupBy({
      by: ['votationItemId'],
      _count: {
        votationItemId: true,
      },
      where: {
        voteFor: {
          votation: {
            id: votation.id,
          },
        },
      },
      orderBy: {
        votationItemId: 'desc',
      },
    });

    const votesFor = votes.reduce(
      (acc, val) => {
        acc[val.votationItemId] = val._count.votationItemId;
        return acc;
      },
      {} as Record<number, number>,
    );

    return votesFor;
  }),

  create: restrictedProcedure('manageVotations')
    .input(
      z.object({
        startsAt: z.date().optional(),
        // If end time is not supplied it will be set to one minute from now
        endsAt: z.date().optional(),
        options: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      const {
        startsAt,
        endsAt = new Date(now.getTime() + 60 * 1000),
        options,
      } = input;
      return await ctx.prisma.votation.create({
        data: {
          startsAt,
          endsAt,
          options: {
            create: options.map((option) => ({
              name: option,
            })),
          },
        },
      });
    }),
});
