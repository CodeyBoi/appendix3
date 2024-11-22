import { z } from 'zod';
import { router, restrictedProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { initObject, sum } from 'utils/array';
import { sortCorpsByName } from 'utils/corps';

export const streckRouter = router({
  getOwnStreckAccount: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const corpsId = ctx.session.user.corps.id;
      const transactions = await ctx.prisma.streckTransaction.findMany({
        where: {
          corpsId,
        },
        orderBy: {
          time: 'asc',
        },
      });

      let balance = 0;
      const transactionsWithBalance = transactions.map((transaction) => {
        balance -= transaction.totalPrice;
        return {
          ...transaction,
          balance,
        };
      });

      return {
        balance,
        transactions: transactionsWithBalance.reverse(),
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

      type SummaryItem = {
        amount: number;
        totalPrice: number;
      };

      const data = await ctx.prisma.streckTransaction.findMany({
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

      const items = Array.from(new Set(data.map((t) => t.item))).sort((a, b) =>
        a.localeCompare(b, 'sv'),
      );

      const summary = data.reduce(
        (acc, transaction) => {
          const item = transaction.item.trim();
          const oldValue = acc[item]
            ? (acc[item] as SummaryItem)
            : {
                amount: 0,
                totalPrice: 0,
              };
          acc[item] = {
            amount: oldValue.amount + transaction.amount,
            totalPrice: oldValue.totalPrice + transaction.totalPrice,
          };
          return acc;
        },
        initObject(items, { amount: 0, totalPrice: 0 }),
      );

      return {
        data,
        items,
        summary: summary ?? {},
      };
    }),

  addTransactions: restrictedProcedure('manageStreck')
    .input(
      z.object({
        transactions: z.array(
          z.object({
            corpsId: z.string().cuid(),
            item: z.string(),
            amount: z.number().int().nonnegative(),
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

  removeTransaction: restrictedProcedure('manageStreck')
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.streckTransaction.delete({
        where: { id },
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

      const dateFilter = {
        gt: dayjs(new Date()).subtract(28, 'days').toDate(),
      };
      const recentlyActiveCorps = (
        await ctx.prisma.corps.findMany({
          select: {
            id: true,
          },
          distinct: ['id'],
          where: {
            OR: [
              {
                streckTransactions: {
                  some: {
                    time: dateFilter,
                  },
                },
              },
              {
                rehearsals: {
                  some: {
                    rehearsal: {
                      date: dateFilter,
                    },
                  },
                },
              },
              {
                gigSignups: {
                  some: {
                    attended: true,
                    gig: {
                      date: dateFilter,
                    },
                  },
                },
              },
            ],
          },
        })
      ).map((e) => e.id);

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
          lastName,
          firstName,
          ISNULL(number),
          number;
      `;

      return activeCorps.sort(sortCorpsByName);
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

  getBleckhornenBalance: protectedProcedure.query(async ({ ctx }) => {
    const balancesQuery = ctx.prisma.$queryRaw<{ balance: number }[]>`
        SELECT
          SUM(COALESCE(amount * pricePer, 0)) AS balance,
        FROM StreckTransaction
      `;
    const unsettledDebtsQuery = ctx.prisma.$queryRaw<{ balance: number }[]>`
        SELECT
          SUM(COALESCE(amount * pricePer, 0)) AS balance,
        FROM StreckTransaction
        GROUP BY corpsId
        HAVING balance < 0
      `;

    const [balances, unsettledDebts] = await Promise.all([
      balancesQuery,
      unsettledDebtsQuery,
    ]);
    return {
      balance: balances[0]?.balance ?? 0,
      unsettledDebt: sum(
        unsettledDebts.map((unsettledDebt) => unsettledDebt.balance),
      ),
    };
  }),
});
