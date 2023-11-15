import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

const WORDS = ['citron', 'dotter', 'fisk', 'gurka'];

export const killerRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.killerGame.findUnique({
        include: {
          participants: {
            include: {
              corps: true,
              myKiller: true,
              myTargets: true,
            },
          },
        },
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
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
        where: {
          id: {
            in: input.participants,
          },
        },
      });

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
          word: gameWords[index] as string,
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
      const targets = await ctx.prisma.killerTarget.createMany({
        data: killerGame.participants.map((participant, index) => ({
          killerCorpsId: participant.id,
          targetCorpsId:
            killerGame.participants[
              (index + 1) % killerGame.participants.length
            ]?.id || 0,
        })),
      });

      return { ...killerGame, targets };
    }),

  kill: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        word: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { gameId, word } = input;
      const corpsId = ctx.session.user.corps.id;
      const killerId = (
        await ctx.prisma.killerCorps.findFirst({
          where: {
            gameId,
            corpsId,
          },
          select: {
            id: true,
          },
        })
      )?.id;

      // From the corps which the user is trying to kill, find THEIR current target and return their word
      //
      // [user] -> [target] -> [their target] <- we want this corps' word
      const correctWord = (
        await ctx.prisma.killerCorps.findFirst({
          select: {
            word: true,
          },
          where: {
            myKiller: {
              killerCorps: {
                timeOfDeath: null,
                myKiller: {
                  killerCorps: {
                    id: killerId,
                  },
                },
              },
            },
          },
        })
      )?.word;

      if (correctWord !== word.trim()) {
        return {
          success: false,
          message: 'Fel ord',
        };
      }

      // Find the corps which the user is trying to kill, and set their time of death
      await ctx.prisma.killerCorps.updateMany({
        where: {
          myKiller: {
            killerCorps: {
              id: killerId,
            },
          },
          timeOfDeath: null,
        },
        data: {
          timeOfDeath: new Date(),
        },
      });

      return {
        success: true,
      };
    }),
});
