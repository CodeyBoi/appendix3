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
            // eslint-disable-next-line prettier/prettier
          },
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
        id: z.number().int().optional(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const corpsId = ctx.session.user.corps.id;
      return ctx.prisma.bingoEntry.upsert({
        where: {
          id: input.id ?? -1,
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
              entryId: entry?.id ?? -1,
              index: i,
            })),
          },
        },
      },
    });
  }),

  isWin: protectedProcedure
    .input(
      z.object({
        entryId: z.number().int(),
        cardId: z.string(),
        marked: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { entryId, cardId, marked } = input;
      const corpsId = ctx.session.user.corps.id;
      const now = new Date();
      const card = await ctx.prisma.bingoCard.findFirst({
        include: {
          entries: true,
        },
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
      card.entries.sort((a,b)=> a.index - b.index);
      let board = new Array(5).fill(null).map((_, i) =>
        new Array(5).fill(null).map((_, j) => {
          const entry = card.entries[i * 5 + j];
          return entry ? entry.marked : false;
        })
      );

     /*let board = new Array(5).map((i) =>
        new Array(5).map((j) => {
          const entry = card.entries[i * 5 + j];
          if (!entry) {
            return false;
          }
          if (entryId === entry.entryId) {
            return true;
          } else {
            return entry.marked;
          }
        }),
      );*/
      
      console.log(
        'BOARD FINNS HÄR---------------------------------------------------------------------------',
      );

      console.log(board);
      console.log(
        'BOARD FINNS HÄR---------------------------------------------------------------------------',
      );
      // Check rows
      for (let row = 0; row < board.length; row++) {
        console.log(
          'DET ÄR ROWS SOM FUCKAR---------------------------------------------------------------------------',
        );
        
       // console.log(board);
        console.log('Test för hitta variabel');
        if (board[row]?.every((marked) => marked === true)) {
          return ctx.prisma.bingoCard.updateMany({
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
            data: {
              isWin: {
                set: true,
              },
            },
          });
        }
      }

      // Check columns
      for (let col = 0; col < (board[0]?.length ?? 0); col++) {
        let hasTrueColumn = true;
        for (let row = 0; row < board.length; row++) {
          if (!board[row]?.[col]) {
            hasTrueColumn = false;
            break;
          }
        }
        if (hasTrueColumn) {
          console.log('DET ÄR COLS SOM FUCKAR');
          return ctx.prisma.bingoCard.updateMany({
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
            data: {
              isWin: {
                set: true,
              },
            },
          });
        }
      }

      // Check diagonals
      let hasTrueDiagonal = true;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]?.[i]) {
          hasTrueDiagonal = false;
          break;
        }
      }
      if (hasTrueDiagonal) {
        console.log('DET ÄR DIAGONAL 1 SOM FUCKAR');
        return ctx.prisma.bingoCard.updateMany({
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
          data: {
            isWin: {
              set: true,
            },
          },
        });
      }

      let hasTrueDiagonal1 = true;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]?.[board.length - 1 - i]) {
          hasTrueDiagonal1 = false;
          break;
        }
      }
      if (hasTrueDiagonal1) {
        console.log('DET ÄR DIAGONAL 2 SOM FUCKAR');
        return ctx.prisma.bingoCard.updateMany({
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
          data: {
            isWin: {
              set: true,
            },
          },
        });
      }

      return ctx.prisma.bingoCard.updateMany({
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
        data: {
          isWin: {
            set: false,
          },
        },
      });
    }),

  markEntry: protectedProcedure
    .input(
      z.object({
        entryId: z.number().int(),
        cardId: z.string(),
        marked: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { entryId, cardId, marked } = input;
      const corpsId = ctx.session.user.corps.id;
      const now = new Date();
      const card = await ctx.prisma.bingoCard.findFirst({
        include: {
          entries: true,
        },
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

      

      const board = new Array(5).map((i) =>
        new Array(5).map((j) => {
          const entry = card.entries[i * 5 + j];
          if (!entry) {
            return false;
          }
          if (entryId === entry.entryId) {
            return true;
          } else {
            return entry.marked;
          }
        }),
      );
   
      console.log(board);

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
