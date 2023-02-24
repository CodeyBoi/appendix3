import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const quoteRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.quote.findUnique({
        where: {
          id,
        },
        include: {
          saidBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              number: true,
            },
          },
          writtenBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              number: true,
            },
          },
        },
      });
    }),

  infiniteScroll: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit = 50 } = input ?? {};
      const items = await ctx.prisma.quote.findMany({
        include: {
          saidBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              number: true,
            },
          },
          writtenBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              number: true,
            },
          },
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: 'desc',
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

  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        quote: z.string(),
        location: z.string(),
        saidByCorpsId: z.string(),
        writtenByCorpsId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ownCorpsId = ctx.session.user.corps.id;
      const {
        id,
        quote,
        location,
        saidByCorpsId,
        writtenByCorpsId = ownCorpsId,
      } = input;
      if (id) {
        // Check if quote was created by the same corps or if corps said the quote,
        // otherwise throw error
        const oldQuote = await ctx.prisma.quote.findUnique({
          where: {
            id,
          },
        });
        if (!oldQuote) {
          throw new Error('Quote not found');
        }
        if (
          ownCorpsId !== oldQuote.saidByCorpsId &&
          ownCorpsId !== oldQuote.writtenByCorpsId
        ) {
          throw new Error('Not allowed to edit another corps quote');
        }
      }
      const data = {
        quote,
        location,
        saidByCorpsId,
        writtenByCorpsId,
      };
      return await ctx.prisma.quote.upsert({
        where: {
          id: id ?? '',
        },
        update: data,
        create: data,
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if quote was created by the same corps or if corps said the quote,
      // otherwise throw error
      const { id } = input;
      const ownCorpsId = ctx.session.user.corps.id;
      const oldQuote = await ctx.prisma.quote.findUnique({
        where: {
          id,
        },
      });
      console.log(oldQuote);
      if (!oldQuote) {
        throw new Error('Quote not found');
      }
      if (
        ownCorpsId !== oldQuote.saidByCorpsId &&
        ownCorpsId !== oldQuote.writtenByCorpsId
      ) {
        throw new Error('Not allowed to delete another corps quote');
      }
      return await ctx.prisma.quote.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
