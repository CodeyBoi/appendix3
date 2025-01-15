import { z } from 'zod';
import { router, restrictedProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { initObject, sum } from 'utils/array';
import { sortCorpsByName } from 'utils/corps';

export const streckRouter = router({
  getOwnStreckAccount: protectedProcedure.query(async ({ ctx }) => {
    const corpsId = ctx.session.user.corps.id;
    const streckLists = await ctx.prisma.streckList.findMany({
      include: {
        transactions: {
          where: {
            corpsId,
            streckList: {
              deleted: false,
            },
          },
        },
      },
      where: {
        transactions: {
          some: {
            corpsId,
            streckList: {
              deleted: false,
            },
          },
        },
      },
      orderBy: {
        time: 'asc',
      },
    });

    let balance = 0;
    const transactionsWithBalance = streckLists.flatMap((streckList) => {
      const firstTransaction = streckList.transactions[0];
      if (!firstTransaction) {
        return [];
      }
      const item =
        new Set(streckList.transactions.map((t) => t.item)).size !== 1
          ? 'Strecklista'
          : firstTransaction.note.trim() || firstTransaction.item;
      const totalPrice = sum(streckList.transactions.map((t) => t.totalPrice));
      balance += totalPrice;
      return [
        {
          id: streckList.id,
          item,
          totalPrice,
          time: streckList.time,
          balance,
        },
      ];
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
        streckListId: z.number().int().optional(),
        take: z.number().int().optional(),
        skip: z.number().int().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { start, end, corpsId, streckListId, take, skip = 0 } = input;

      interface SummaryItem {
        amount: number;
        totalPrice: number;
      }

      const data = await ctx.prisma.streckTransaction.findMany({
        include: {
          corps: true,
        },
        where: {
          streckList: {
            time: { gte: start, lte: end },
            deleted: false,
          },
          corpsId,
          streckListId,
        },
        orderBy: {
          streckList: {
            time: 'desc',
          },
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
        summary,
      };
    }),

  upsertStreckList: restrictedProcedure('manageStreck')
    .input(
      z.object({
        id: z.number().int().optional(),
        transactions: z.array(
          z.object({
            corpsId: z.string().cuid(),
            item: z.string(),
            amount: z.number().int().nonnegative(),
            pricePer: z.number().int(),
            verificationNumber: z.string().optional(),
            note: z.string().optional(),
            time: z.date().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, transactions } = input;
      const corpsId = ctx.session.user.corps.id;

      if (id) {
        await ctx.prisma.streckTransaction.deleteMany({
          where: {
            streckListId: id,
          },
        });
      }

      const res = await ctx.prisma.streckList.upsert({
        where: {
          id: id ?? -1,
        },
        update: {
          transactions: {
            createMany: {
              data: transactions,
            },
          },
        },
        create: {
          createdBy: {
            connect: {
              id: corpsId,
            },
          },
          transactions: {
            createMany: {
              data: transactions,
            },
          },
        },
      });

      return res;
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
        listId: z.number().int(),
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

  getActiveCorps: protectedProcedure
    .input(
      z.object({
        additionalCorps: z.array(z.string().cuid()).optional(),
        time: z.date().optional(),
        activeFrom: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      interface ActiveCorps {
        id: string;
        number: number | null;
        firstName: string;
        lastName: string;
        nickName: string | null;
        balance: number;
      }

      const {
        additionalCorps = [],
        time = new Date(),
        activeFrom = dayjs(time).subtract(1, 'month').toDate(),
      } = input;

      const shouldGetAll = dayjs(activeFrom).isSame(dayjs('1971-01-01'), 'day');
      const dateFilter = {
        gte: dayjs(activeFrom).startOf('day').toDate(),
        lte: dayjs(time).endOf('day').toDate(),
      };
      const recentlyActiveCorps = (
        await ctx.prisma.corps.findMany({
          select: {
            id: true,
          },
          distinct: ['id'],
          where: shouldGetAll
            ? undefined
            : {
                OR: [
                  {
                    streckTransactions: {
                      some: {
                        streckList: {
                          time: dateFilter,
                        },
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
        LEFT JOIN StreckList ON streckListId = StreckList.id
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
        listId: z.number().int().optional(),
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
    const balances = (
      await ctx.prisma.$queryRaw<{ balance: number }[]>`
        SELECT
          SUM(COALESCE(amount * pricePer, 0)) AS balance
        FROM StreckTransaction
        GROUP BY corpsId
      `
    ).map((e) => e.balance);

    return {
      balance: sum(balances),
      unsettledDebt: sum(balances.filter((balance) => balance < 0)),
    };
  }),

  getStreckList: restrictedProcedure('manageStreck')
    .input(
      z.object({
        id: z.number().int(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const res = await ctx.prisma.streckList.findUnique({
        where: {
          id,
        },
        include: {
          transactions: {
            include: {
              corps: true,
            },
          },
        },
      });
      return res;
    }),

  getStreckLists: restrictedProcedure('manageStreck')
    .input(
      z.object({
        start: z.date().optional(),
        end: z.date().optional(),
        getTransactions: z.boolean().optional(),
        take: z.number().int().optional(),
        skip: z.number().int().optional(),
        deleted: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        start,
        end,
        getTransactions = false,
        take,
        skip,
        deleted = false,
      } = input;
      const streckLists = await ctx.prisma.streckList.findMany({
        where: {
          time: { gte: start, lte: end },
          deleted,
        },
        include: {
          createdBy: true,
          transactions: {
            include: {
              corps: true,
            },
          },
        },
        take,
        skip,
        orderBy: {
          time: 'desc',
        },
      });

      const res = streckLists.map((streckList) => ({
        ...streckList,
        transactions: getTransactions ? streckList.transactions : [],
        totalChange: sum(streckList.transactions.map((t) => t.totalPrice)),
      }));

      return res;
    }),

  deleteStreckList: restrictedProcedure('manageStreck')
    .input(
      z.object({
        id: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.streckList.update({
        where: { id },
        data: {
          deleted: true,
        },
      });
    }),

  restoreStreckList: restrictedProcedure('manageStreck')
    .input(
      z.object({
        id: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.streckList.update({
        where: { id },
        data: {
          deleted: false,
        },
      });
    }),

  removeStreckList: restrictedProcedure('manageStreck')
    .input(
      z.object({
        id: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.streckList.delete({
        where: { id },
      });
    }),
});
