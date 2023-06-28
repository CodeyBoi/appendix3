import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const bingoRouter = router({
  getCard: protectedProcedure.query(async ({ ctx }) => {
    const corpsId = ctx.session.user.corps.id;
    const now = new Date();
    return ctx.prisma.bingoCorpsCard.findFirst({
      include: {
        entries: true,
        marked: true,
      },
      where: {
        corpsId,
        validFrom: {
          lte: now,
        },
        validTo: {
          gte: now,
        },
      },
    });
  }),

  upsertEntry: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const corpsId = ctx.session.user.corps.id;
      return ctx.prisma.bingoEntry.upsert({
        where: {
          id: input.id ?? '',
        },
        update: {
          text: input.text,
        },
        create: {
          text: input.text,
          createdBy: {
            connect: {
              id: corpsId,
            },
          },
        },
      });
    }),

  generateCard: protectedProcedure.mutation(async ({ ctx }) => {
    const corpsId = ctx.session.user.corps.id;
    const allEntries = await ctx.prisma.bingoEntry.findMany({});

    const indices: number[] = [];
    while (indices.length < 25 && indices.length < allEntries.length) {
      const randomIndex = Math.floor(Math.random() * allEntries.length);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }

    // Get elements at random indices
    const entries = indices.map((i) => allEntries[i]);
    const now = new Date();
    const day = now.getDay();
    const daysUntilThursday = (11 - day) % 7;
    const nextThursday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilThursday,
    );

    return ctx.prisma.bingoCorpsCard.create({
      data: {
        corps: { connect: { id: corpsId } },
        validTo: nextThursday,
        validFrom: now,
        entries: {
          connect: entries.map((entry) => ({
            id: entry?.id ?? '',
          })),
        },
      },
    });
  }),

  markEntry: protectedProcedure
    .input(
      z.object({
        entryId: z.string(),
        cardId: z.string(),
        marked: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const corpsId = ctx.session.user.corps.id;
      const now = new Date();
      const card = await ctx.prisma.bingoCorpsCard.findFirst({
        where: {
          id: input.cardId,
          corpsId,
          validFrom: {
            lte: now,
          },
          validTo: {
            gte: now,
          },
        },
      });

      if (!card) {
        throw new Error('Card not found');
      }

      if (card.corpsId !== corpsId) {
        throw new Error('Corps unauthorized to mark this bingo card');
      }

      if (input.marked) {
        return ctx.prisma.bingoMarked.create({
          data: {
            entry: {
              connect: {
                id: input.entryId,
              },
            },
            card: {
              connect: {
                id: input.cardId,
              },
            },
          },
        });
      } else {
        return ctx.prisma.bingoMarked.deleteMany({
          where: {
            entryId: input.entryId,
            cardId: input.cardId,
          },
        });
      }
    }),
});
