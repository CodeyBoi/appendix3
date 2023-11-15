import { router, protectedProcedure, adminProcedure } from '../trpc';
import { z } from 'zod';

const WORDS = [
  { sv: 'citron', en: 'lemon' },
  { sv: 'dotter', en: 'daughter' },
  { sv: 'fisk', en: 'fish' },
  { sv: 'gurka', en: 'cucumber' },
  { sv: 'apa', en: 'monkey' },
  { sv: 'gorilla', en: 'gorilla' },
  { sv: 'rödlök', en: 'red onion' },
  { sv: 'paprika', en: 'bell pepper' },
  { sv: 'potatis', en: 'potato' },
  { sv: 'tomat', en: 'tomato' },
  { sv: 'katt', en: 'cat' },
  { sv: 'hund', en: 'dog' },
];

export const killerRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        const date = new Date();
        return ctx.prisma.killerGame.findFirst({
          include: {
            participants: {
              include: {
                corps: true,
                target: true,
              },
            },
          },
          where: {
            participants: {
              some: {
                corpsId: ctx.session.user.corps.id,
              },
            },
            start: {
              lte: date,
            },
            end: {
              gte: date,
            },
          },
        });
      }

      return ctx.prisma.killerGame.findUnique({
        include: {
          participants: {
            include: {
              corps: true,
              target: true,
            },
          },
        },
        where: {
          id: input.id,
        },
      });
    }),

  getCurrentInfo: protectedProcedure.query(async ({ ctx }) => {
    const date = new Date();
    const game = await ctx.prisma.killerGame.findFirst({
      where: {
        start: {
          lte: date,
        },
        end: {
          gte: date,
        },
      },
    });

    if (!game) {
      return null;
    }

    const killer = await ctx.prisma.killerCorps.findFirst({
      where: {
        corpsId: ctx.session.user.corps.id,
        gameId: game.id,
      },
      include: {
        game: true,
        corps: true,
        kills: {
          include: {
            corps: true,
          },
        },
        target: {
          include: {
            corps: true,
          },
        },
        killedBy: {
          include: {
            corps: true,
          },
        },
      },
    });

    if (!killer) {
      throw new Error('Corps is not in this game');
    }

    return {
      killer,
      game,
    };
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        start: z.date(),
        end: z.date(),
        participants: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const participants = await ctx.prisma.corps.findMany({
        select: {
          id: true,
        },
        where: {
          id: {
            in: input.participants,
          },
        },
      });

      // Collect a random subset of words in a random order
      const gameWords = WORDS.sort(() => Math.random() - 0.5).slice(
        0,
        participants.length,
      );
      const shuffledParticipants = participants
        .sort(() => Math.random() - 0.5)
        .map((participant, index) => ({
          corps: {
            connect: {
              id: participant.id ?? '',
            },
          },
          word: gameWords[index]?.sv as string,
          wordEnglish: gameWords[index]?.en as string,
        }));

      const killerGame = await ctx.prisma.killerGame.create({
        data: {
          name: input.name,
          start: input.start,
          end: input.end,
          participants: {
            create: shuffledParticipants,
          },
        },
        include: {
          participants: true,
        },
      });

      // Connect the participants to their targets
      await ctx.prisma.$transaction(async () =>
        killerGame.participants.map(async (participant, index) =>
          ctx.prisma.killerCorps.update({
            where: {
              id: participant.id,
            },
            data: {
              target: {
                connect: {
                  id:
                    killerGame.participants[
                      (index + 1) % killerGame.participants.length
                    ]?.id || 0,
                },
              },
            },
          }),
        ),
      );

      // Return the game with the participants and their targets
      const res = await ctx.prisma.killerGame.findUnique({
        where: {
          id: killerGame.id,
        },
        include: {
          participants: {
            include: {
              target: true,
              corps: true,
            },
          },
        },
      });

      return res;
    }),

  kill: protectedProcedure
    .input(
      z.object({
        word: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { word } = input;
      const corpsId = ctx.session.user.corps.id;

      const date = new Date();
      const game = await ctx.prisma.killerGame.findFirst({
        where: {
          participants: {
            some: {
              corpsId,
            },
          },
          start: {
            lte: date,
          },
          end: {
            gte: date,
          },
        },
      });

      if (!game) {
        throw new Error('No game found');
      }

      // From the corps which the user is trying to kill, find THEIR current target and return their word
      //
      // [user] -> [target] -> [their target] <- we want this corps' word
      const killer = await ctx.prisma.killerCorps.findFirst({
        where: {
          corpsId,
          gameId: game.id,
        },
        select: {
          id: true,
          target: {
            select: {
              id: true,
              target: {
                select: {
                  id: true,
                  word: true,
                  wordEnglish: true,
                },
              },
            },
          },
        },
      });

      if (!killer) {
        throw new Error('Corps is not in this game');
      }

      const svWord = killer?.target?.target?.word;
      const enWord = killer?.target?.target?.wordEnglish;
      if (!svWord || !enWord) {
        throw new Error('No word for your target found');
      }

      if (
        svWord !== word.trim().toLowerCase() &&
        enWord !== word.trim().toLowerCase()
      ) {
        return {
          success: false,
          message: 'Fel ord',
        };
      }

      // Find the corps which the user is trying to kill, and set their time of death
      await ctx.prisma.killerCorps.update({
        where: {
          id: killer.target?.id,
        },
        data: {
          targetId: null,
          timeOfDeath: new Date(),
          killedById: killer.id,
        },
      });

      const targetsTarget = killer.target?.target?.id;
      if (targetsTarget === killer.id) {
        // If the user gains themselves as a target, they are the last one standing
        await ctx.prisma.killerGame.update({
          where: {
            id: game.id,
          },
          data: {
            end: new Date(),
          },
        });
        return {
          success: true,
          message: 'Spelet har avslutats!',
        };
      }

      // Update the user's target to be the target of the corps they just killed
      await ctx.prisma.killerCorps.update({
        where: {
          id: killer.id,
        },
        data: {
          targetId: targetsTarget,
        },
      });

      return {
        success: true,
      };
    }),
});
