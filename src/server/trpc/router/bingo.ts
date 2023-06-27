import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const bingoRouter = router({
  getCard: protectedProcedure
    .query(async ({ ctx }) => {
      const corpsId = ctx.session.user.corps.id;
      const now = new Date();
      return ctx.prisma.bingoCorpsCard.findFirst({
        include: {
          entries: true,
        },
        where: {
          corpsId,
          validFrom: {
            lte: now,
          },
          validTo: {
            gte: now,
          }
        },
      })
    }),

  upsertEntry: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const corpsId = ctx.session.user.corps.id;
      return ctx.prisma.bingoEntry.upsert({
        where: {
          id: input.id ?? ''
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



  generateCard: protectedProcedure
    .mutation(async ({ ctx }) => {
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
          entries: entries.map((entry) => {

          })

        },
      });
    }),

});
