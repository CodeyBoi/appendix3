import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import dayjs from 'dayjs';

export const bingoRouter = router({
  getCard: protectedProcedure.query(async ({ ctx }) => {
    const corpsId = ctx.session.user.corps.id;
    const now = new Date();
    return ctx.prisma.bingoCard.findFirst({
      include: {
        entries: {
          include: {
            entry: true,
          }
        },
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
    const isThursday = day == 4;
    const daysUntilThursday = isThursday ? 7 : (11 - day) % 7;
    const nextThursday = dayjs().add(daysUntilThursday, 'day').toDate();

    return ctx.prisma.bingoCard.create({
      data: {
        corps: { connect: { id: corpsId } },
        validTo: nextThursday,
        validFrom: now,
        entries: {
          createMany: {
            data: entries.map((entry, i) => ({
              entryId: entry?.id ?? '',
              index: i,
            })),
          },
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
      const { entryId, cardId, marked } = input;
      const corpsId = ctx.session.user.corps.id;
      const now = new Date();
      const card = await ctx.prisma.bingoCard.findFirst({
        where: {
          id: cardId,
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

      return ctx.prisma.bingoCardEntry.update({
        where: {
          cardId_entryId: {
            cardId,
            entryId,
          },
        },
        data: {
          marked,
        },
      });
    }),
});
