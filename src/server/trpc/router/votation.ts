import { z } from 'zod';
import { protectedProcedure, restrictedProcedure, router } from '../trpc';

export const votationRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const corpsId = ctx.session.user.corps.id;
    const votation = await ctx.prisma.votation.findFirst({
      where: {
        startsAt: {
          lte: now,
        },
        endsAt: {
          gte: new Date(now.getTime() - 5 * 60 * 1000),
        },
      },
      include: {
        options: true,
      },
    });

    if (!votation) {
      return null;
    }

    const hasVotedQuery = await ctx.prisma.votation.findFirst({
      where: {
        id: votation.id,
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

    const hasVoted = !!hasVotedQuery;

    return {
      ...votation,
      hasVoted,
    };
  }),

  vote: protectedProcedure
    .input(
      z.object({
        votationItemIds: z.number().int().or(z.array(z.number().int())),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const corpsId = ctx.session.user.corps.id;
      const votationItemIds = Array.isArray(input.votationItemIds)
        ? input.votationItemIds
        : [input.votationItemIds];

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
                  votationItemId: {
                    in: votationItemIds,
                  },
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

      const res = await ctx.prisma.vote.createMany({
        data: votationItemIds.map((id) => ({
          corpsId,
          votationItemId: id,
        })),
      });
      return res;
    }),

  getResult: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const votation = await ctx.prisma.votation.findUniqueOrThrow({
        include: {
          options: {
            include: {
              votes: true,
            },
          },
        },
        where: {
          id: input.id,
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
              id: input.id,
            },
          },
        },
        orderBy: {
          _count: {
            votationItemId: 'desc',
          },
        },
      });

      const votesFor = votes.reduce(
        (acc, val) => {
          acc[val.votationItemId] = val._count.votationItemId;
          return acc;
        },
        {} as Record<number, number>,
      );

      const res = votation.options.map((option) => ({
        ...option,
        votes: votesFor[option.id] ?? 0,
      }));

      res.sort((a, b) => b.votes - a.votes);

      return res;
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
