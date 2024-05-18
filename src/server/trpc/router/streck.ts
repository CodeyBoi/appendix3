import { z } from 'zod';
import { router, restrictedProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

export const streckRouter = router({
  getOwnStreckAccount: protectedProcedure
    .input(
      z.object({
        take: z.number().int().optional(),
        skip: z.number().int().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { take = 50, skip = 0 } = input;
      const corpsId = ctx.session.user.corps.id;
      const transactionsQuery = ctx.prisma.streckTransaction.findMany({
        where: {
          corpsId,
        },
        take,
        skip,
      });
      const balanceListQuery = ctx.prisma.streckTransaction.findMany({
        select: {
          totalPrice: true,
        },
        where: { corpsId },
      });

      const [transactions, balanceList] = await Promise.all([
        transactionsQuery,
        balanceListQuery,
      ]);

      const balance = balanceList.reduce((acc, t) => acc + t.totalPrice, 0);

      return {
        balance,
        transactions,
      };
    }),

  getTransactions: restrictedProcedure('manageStreck')
    .input(
      z.object({
        start: z.date().optional(),
        end: z.date().optional(),
        corpsId: z.string().cuid().optional(),
        take: z.number().int().optional(),
        skip: z.number().int().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { start, end, corpsId, take = 50, skip = 0 } = input;

      return ctx.prisma.streckTransaction.findMany({
        include: {
          corps: true,
        },
        where: {
          time: { gte: start, lte: end },
          corpsId,
        },
        orderBy: {
          time: 'desc',
        },
        take,
        skip,
      });
    }),

  addTransactions: restrictedProcedure('manageStreck')
    .input(
      z.object({
        transactions: z.array(
          z.object({
            corpsId: z.string().cuid(),
            item: z.string(),
            amount: z.number().int(),
            pricePer: z.number().int(),
            time: z.date().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { transactions } = input;

      return await ctx.prisma.streckTransaction.createMany({
        data: transactions,
      });
    }),

  getItems: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.streckItem.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }),

  upsertItem: restrictedProcedure('manageStreck')
    .input(
      z.object({
        id: z.number().int().optional(),
        name: z.string().min(1),
        price: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id = -1, name, price } = input;
      return await ctx.prisma.streckItem.upsert({
        where: { id },
        create: input,
        update: {
          name,
          price,
        },
      });
    }),

  removeItem: restrictedProcedure('manageStreck')
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.streckItem.delete({
        where: { id },
      });
    }),

  getActiveCorps: protectedProcedure
    .input(
      z.object({
        additionalCorps: z.array(z.string().cuid()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      type ActiveCorps = {
        id: string;
        number: number | null;
        firstName: string;
        lastName: string;
        nickName: string | null;
        balance: number;
      };

      const { additionalCorps = [] } = input;

      const recentlyActiveCorps = (
        await ctx.prisma.streckTransaction.findMany({
          select: {
            corpsId: true,
          },
          distinct: ['corpsId'],
          where: {
            time: {
              gt: dayjs(new Date()).subtract(28, 'days').toDate(),
            },
          },
        })
      ).map((e) => e.corpsId);

      additionalCorps.push(...recentlyActiveCorps);

      if (additionalCorps.length === 0) {
        // This is to stop Prisma.join complaining about getting an empty array
        additionalCorps.push('DUMMY VALUE');
      }

      const activeCorps = await ctx.prisma.$queryRaw<ActiveCorps[]>`
        SELECT
          Corps.id as id,
          number,
          firstName,
          lastName,
          nickName,
          SUM(COALESCE(amount * pricePer, 0)) AS balance
        FROM Corps
        LEFT JOIN StreckTransaction ON Corps.id = corpsId
        WHERE Corps.id IN (${Prisma.join(additionalCorps)})
        GROUP BY Corps.id
        ORDER BY
          ISNULL(number),
          number,
          lastName,
          firstName;
      `;

      return activeCorps;
    }),

  setPrices: restrictedProcedure('manageStreck')
    .input(
      z.object({
        items: z.array(
          z.object({
            name: z.string(),
            price: z.number().int(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { items } = input;
      await ctx.prisma.streckItem.deleteMany({});
      const res = await ctx.prisma.streckItem.createMany({
        data: items.map((item, i) => ({ ...item, id: i + 1 })),
      });
      return res;
    }),
});
