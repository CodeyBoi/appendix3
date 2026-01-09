import { z } from 'zod';
import { router, restrictedProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { initObject, sum, toMap } from 'utils/array';
import { sortCorpsByName } from 'utils/corps';
import ExcelJS from 'exceljs';
import { Context } from '../context';

interface ActiveCorps {
  id: string;
  number: number | null;
  bNumber: number | null;
  firstName: string;
  lastName: string;
  nickName: string | null;
  balance: number;
}

const getStreckList = async (ctx: Context, id: number) => {
  const res = await ctx.prisma.streckList.findUnique({
    where: {
      id,
    },
    include: {
      transactions: {
        include: {
          corps: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              number: true,
              bNumber: true,
            },
          },
        },
      },
    },
  });
  return res;
};

const GetBalancesInput = z.object({
  additionalCorps: z.array(z.string().cuid()).optional(),
  excludeCorps: z.array(z.string().cuid()).optional(),
  time: z.date().optional(),
  activeFrom: z.date().optional(),
  activeUntil: z.date().optional(),
});

const getBalances = async (
  ctx: Context,
  input: z.infer<typeof GetBalancesInput>,
) => {
  const {
    additionalCorps = [],
    excludeCorps = [],
    time = dayjs().endOf('day').toDate(),
    activeFrom = dayjs(time).subtract(1, 'month').toDate(),
    activeUntil = time,
  } = input;

  const shouldGetAll = dayjs(activeFrom).isSame(dayjs('1970-01-01'), 'day');
  const dateFilter = {
    gte: dayjs(activeFrom).startOf('day').toDate(),
    lte: dayjs(activeUntil).endOf('day').toDate(),
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
  if (excludeCorps.length === 0) {
    // This is to stop Prisma.join complaining about getting an empty array
    excludeCorps.push('DUMMY VALUE');
  }

  const activeCorps = await ctx.prisma.$queryRaw<ActiveCorps[]>`
        SELECT
          Corps.id as id,
          number,
          bNumber,
          firstName,
          lastName,
          nickName,
          SUM(COALESCE(amount * pricePer, 0)) AS balance
        FROM Corps
        LEFT JOIN StreckTransaction ON Corps.id = corpsId
        LEFT JOIN StreckList ON streckListId = StreckList.id
          AND StreckList.time <= ${time}
          AND deleted = false
        WHERE Corps.id IN (${Prisma.join(additionalCorps)})
          AND Corps.id NOT IN (${Prisma.join(excludeCorps)})
        GROUP BY Corps.id
        ORDER BY
          lastName,
          firstName,
          ISNULL(number),
          number,
          ISNULL(bNumber),
          bNumber;
      `;

  return activeCorps.sort(sortCorpsByName);
};

export type StreckList = NonNullable<Awaited<ReturnType<typeof getStreckList>>>;

export const toStreckListMatrix = (
  transactions: StreckList['transactions'],
) => {
  const listType = transactions.some((t) => t.amount !== 1)
    ? 'strecklist'
    : transactions.every((t) => t.pricePer < 0)
    ? 'cost'
    : 'deposit';

  const getValue = (transaction: { amount: number; pricePer: number }) => {
    switch (listType) {
      case 'strecklist':
        return transaction.amount;
      case 'cost':
        return -transaction.pricePer;
      case 'deposit':
        return transaction.pricePer;
    }
  };

  const items = Array.from(new Set(transactions.map((t) => t.item)).values());

  const corpsTransactions = transactions.reduce((acc, transaction) => {
    const corpsId = transaction.corps.id;
    const mapValue = acc.get(corpsId) ?? {
      corps: transaction.corps,
      amounts: new Map<string, number>(),
    };
    mapValue.amounts.set(transaction.item, getValue(transaction));
    acc.set(corpsId, mapValue);
    return acc;
  }, new Map<string, { corps: (typeof transactions)[number]['corps']; amounts: Map<string, number> }>());

  const corpsii = Array.from(corpsTransactions.values());
  corpsii.sort((a, b) => sortCorpsByName(a.corps, b.corps));

  return {
    corpsii,
    items,
  };
};

const getStreckAccount = async ({
  ctx,
  corpsId,
}: {
  ctx: Context;
  corpsId: string;
}) => {
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
};

export const streckRouter = router({
  getOwnStreckAccount: protectedProcedure.query(async ({ ctx }) => {
    const corpsId = ctx.session.user.corps.id;
    const res = await getStreckAccount({ ctx, corpsId });
    return res;
  }),

  getStreckAccount: restrictedProcedure('viewStreck')
    .input(z.object({ corpsId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { corpsId } = input;
      const res = await getStreckAccount({ ctx, corpsId });
      return res;
    }),

  getTransactions: restrictedProcedure('viewStreck')
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

  getCorpsBalances: protectedProcedure
    .input(GetBalancesInput)
    .query(async ({ ctx, input }) => getBalances(ctx, input)),

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

  get: restrictedProcedure('viewStreck')
    .input(
      z.object({
        id: z.number().int(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const res = await getStreckList(ctx, id);
      return res;
    }),

  getStreckLists: restrictedProcedure('viewStreck')
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

  exportStreckList: restrictedProcedure('viewStreck')
    .input(
      z.object({
        id: z.number().int(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const sumRow = 1;
      const headerRow = 2;
      const { id } = input;

      const streckList = await getStreckList(ctx, id);
      if (!streckList) {
        throw Error(`No strecklist exists with id: ${id}`);
      }

      const corpsBalances = await getBalances(ctx, { time: streckList.time });

      const passiveCorpsBalances = await getBalances(ctx, {
        activeFrom: new Date('2024-01-01'), // Strecklistan started existing at blindtarmen 2024-12-16
        excludeCorps: corpsBalances.map((c) => c.id),
      });

      const items = streckList.transactions
        .reduce<{ name: string; pricePer: number }[]>((acc, transaction) => {
          if (!acc.find((i) => i.name === transaction.item)) {
            acc.push({
              name: transaction.item,
              pricePer: -transaction.pricePer,
            });
          }
          return acc;
        }, [])
        .sort((a, b) => a.name.localeCompare(b.name, 'sv'));

      const workbook = new ExcelJS.Workbook();

      const addSheet = (name: string, columns: string[]) => {
        const sheet = workbook.addWorksheet(name, {
          pageSetup: {
            paperSize: 9,
            orientation: 'portrait',
            printTitlesRow: `${sumRow}:${headerRow}`,
          },
          views: [
            {
              state: 'frozen',
              ySplit: 2,
              xSplit: 5,
            },
          ],
        });
        sheet.getRow(headerRow).values = columns;
        sheet.getColumn(1).width = 5;
        sheet.getColumn(2).width = 15;
        sheet.getColumn(3).width = 19;

        sheet.getRow(headerRow).alignment = {
          wrapText: true,
          horizontal: 'left',
          vertical: 'bottom',
        };
        sheet.getRow(headerRow).height = 60;

        sheet.addConditionalFormatting({
          ref: 'D3:E10000',
          rules: [
            {
              priority: 2,
              type: 'expression',
              formulae: ['AND(0<=D3,D3<200,NOT(ISBLANK(D3)))'],
              style: {
                fill: {
                  type: 'pattern',
                  pattern: 'solid',
                  bgColor: {
                    argb: 'ffdeebf7',
                  },
                  fgColor: {
                    argb: 'ff4472c4',
                  },
                },
              },
            },
            {
              priority: 3,
              type: 'expression',
              formulae: ['AND(D3<0,NOT(ISBLANK(D3)))'],
              style: {
                fill: {
                  type: 'pattern',
                  pattern: 'solid',
                  bgColor: {
                    argb: 'ffffcccc',
                  },
                  fgColor: {
                    argb: 'ff990000',
                  },
                },
              },
            },
          ],
        });

        return sheet;
      };

      const activeSheet = addSheet('Aktiva', [
        'Nr',
        'Förnamn',
        'Efternamn',
        'Nytt saldo',
        'Gammalt saldo',
        ...items.map((item) => `${item.name} ${item.pricePer}p`),
      ]);
      const corpsTransactions = toMap(
        streckList.transactions,
        (t) => `${t.corps.id}:${t.item}`,
        (t) => t.amount,
      );
      for (const corps of corpsBalances) {
        const previousBalance =
          +corps.balance +
          sum(
            items.map(
              (item) =>
                (corpsTransactions.get(`${corps.id}:${item.name}`) ?? 0) *
                item.pricePer,
            ),
          );
        const amounts = items.map(
          (item) =>
            corpsTransactions.get(`${corps.id}:${item.name}`)?.toString() ?? '',
        );
        activeSheet.addRow([
          corps.number?.toString() ?? '',
          corps.firstName,
          corps.lastName,
          +corps.balance,
          +previousBalance,
          ...amounts,
        ]);
      }

      const passiveSheet = addSheet('Passiva', [
        'Nr',
        'Förnamn',
        'Efternamn',
        'Saldo',
      ]);
      for (const corps of passiveCorpsBalances) {
        passiveSheet.addRow([
          corps.number?.toString() ?? '',
          corps.firstName,
          corps.lastName,
          +corps.balance,
        ]);
      }

      interface Summary {
        total: number;
        amount: number;
      }

      const summarySheet = workbook.addWorksheet('Sammanfattning', {
        pageSetup: {
          paperSize: 9,
          orientation: 'portrait',
          printTitlesRow: `${headerRow}:${headerRow}`,
        },
      });

      const summaryHeader = summarySheet.getRow(headerRow);
      summaryHeader.values = ['Artikel', 'Styckpris', 'Antal', 'Totalpris'];
      summaryHeader.font = {
        name: 'Arial',
        bold: true,
      };
      summarySheet.getColumn(1).width = 19;
      summarySheet.getColumn(2).width = 11;
      summarySheet.getColumn(4).width = 11;

      const summaries = streckList.transactions.reduce((acc, transaction) => {
        const prev = acc.get(transaction.item);
        acc.set(transaction.item, {
          total: (prev?.total ?? 0) + transaction.totalPrice,
          amount: (prev?.amount ?? 0) + transaction.amount,
        });
        return acc;
      }, new Map<string, Summary>());

      for (const item of items) {
        const summary = summaries.get(item.name);
        if (!summary) {
          continue;
        }
        summarySheet.addRow([
          item.name,
          item.pricePer,
          summary.amount,
          -summary.total,
        ]);
      }

      const filename = `Strecklista_${dayjs(streckList.time)
        .locale('sv')
        .format('YYYY-MM-DD_HH-mm')}.xlsx`;
      const data = await workbook.xlsx.writeBuffer();
      ctx.res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      ctx.res.setHeader(
        'Content-Disposition',
        `attachment; filename=${filename}`,
      );
      ctx.res.send(data);
      return {
        success: true,
      };
    }),
});
