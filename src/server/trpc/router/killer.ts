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
              target: true,
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

      // Connect the participants to their targets
      await ctx.prisma.$transaction(async () =>
        killerGame.participants.map((participant, index) =>
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
            },
          },
        },
      });

      return res;
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

      // From the corps which the user is trying to kill, find THEIR current target and return their word
      //
      // [user] -> [target] -> [their target] <- we want this corps' word
      const killer = await ctx.prisma.killerCorps.findFirst({
        where: {
          corpsId,
          gameId,
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
                },
              },
            },
          },
        },
      });

      if (!killer) {
        throw new Error('Corps is not in this game');
      }

      const correctWord = killer?.target?.target?.word;
      if (!correctWord) {
        throw new Error('No word for your target found');
      }

      if (correctWord !== word.trim()) {
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

      // Update the user's target to be the target of the corps they just killed
      const targetsTarget = killer.target?.target?.id;
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
