import dayjs from 'dayjs';
import { router, protectedProcedure, restrictedProcedure } from '../trpc';
import { z } from 'zod';
import { numberAndFullName } from 'utils/corps';

interface Word {
  sv: string;
  en: string;
}

export const WORDS: Word[] = [
  { sv: 'ananas', en: 'pineapple' },
  { sv: 'jobb', en: 'work' },
  { sv: 'aska', en: 'ash' },
  { sv: 'boll', en: 'ball' },
  { sv: 'bagare', en: 'baker' },
  { sv: 'bi', en: 'bee' },
  { sv: 'cigarett', en: 'cigarette' },
  { sv: 'clown', en: 'clown' },
  { sv: 'cool grape', en: 'cool grape' },
  { sv: 'barn', en: 'children' },
  { sv: 'damm', en: 'dust' },
  { sv: 'diarré', en: 'diarrhea' },
  { sv: 'duscha', en: 'shower' },
  { sv: 'elefant', en: 'elephant' },
  { sv: 'fax', en: 'fax' },
  { sv: 'frimärke', en: 'stamp' },
  { sv: 'fågel', en: 'bird' },
  { sv: 'tejp', en: 'tape' },
  { sv: 'hals', en: 'neck' },
  { sv: 'hammare', en: 'hammer' },
  { sv: 'häst', en: 'horse' },
  { sv: 'skydd', en: 'protection' },
  { sv: 'kvarn', en: 'mill' },
  { sv: 'kapitel', en: 'chapter' },
  { sv: 'killergame', en: 'killer game' },
  { sv: 'kjol', en: 'skirt' },
  { sv: 'ko', en: 'cow' },
  { sv: 'bok', en: 'book' },
  { sv: 'kollega', en: 'colleague' },
  { sv: 'kupong', en: 'coupon' },
  { sv: 'kvadrat', en: 'square' },
  { sv: 'källare', en: 'basement' },
  { sv: 'madrass', en: 'mattress' },
  { sv: 'margarin', en: 'margarine' },
  { sv: 'rock', en: 'coat' },
  { sv: 'wifi', en: 'wifi' },
  { sv: 'bank', en: 'bank' },
  { sv: 'kanin', en: 'rabbit' },
  { sv: 'programmering', en: 'programming' },
  { sv: 'schampo', en: 'shampoo' },
  { sv: 'sjukhus', en: 'hospital' },
  { sv: 'bänk', en: 'bench' },
  { sv: 'dator', en: 'computer' },
  { sv: 'film', en: 'movie' },
  { sv: 'trappa', en: 'stairs' },
  { sv: 'buss', en: 'bus' },
  { sv: 'strykjärn', en: 'iron' },
  { sv: 'lampa', en: 'lamp' },
  { sv: 'borste', en: 'brush' },
  { sv: 'tandkräm', en: 'toothpaste' },
  { sv: 'gammal', en: 'old' },
  { sv: 'toalett', en: 'toilet' },
  { sv: 'torka', en: 'dry' },
  { sv: 'tugga', en: 'chew' },
  { sv: 'tunnel', en: 'tunnel' },
  { sv: 'turist', en: 'tourist' },
  { sv: 'tvätt', en: 'laundry' },
  { sv: 'stuga', en: 'cottage' },
  { sv: 'tändsticka', en: 'match' },
  { sv: 'sovrum', en: 'sleeping room' },
  { sv: 'choklad', en: 'chocolate' },
  { sv: 'vapen', en: 'weapon' },
  { sv: 'melon', en: 'melon' },
  { sv: 'pistol', en: 'gun' },
  { sv: 'återvinning', en: 'recycling' },
  { sv: 'öken', en: 'desert' },
  { sv: 'sovsäck', en: 'sleeping bag' },
].sort((a, b) => a.sv.localeCompare(b.sv, 'sv-SE'));

export const killerRouter = router({
  get: restrictedProcedure('manageKiller')
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const date = new Date();
      const whereClause = input.id
        ? { id: input.id }
        : {
            start: {
              lte: dayjs(date).add(1, 'month').toDate(),
            },
            end: {
              gte: dayjs(date).subtract(1, 'week').toDate(),
            },
          };

      const game = await ctx.prisma.killerGame.findFirst({
        include: {
          participants: {
            include: {
              corps: true,
              target: true,
            },
          },
        },
        where: whereClause,
      });

      if (!game) {
        return null;
      }

      if (
        game.participants.length === 0 ||
        game.participants.every((p) => p.target === null)
      ) {
        return game;
      }

      // First add all participants in an order so that every participant has the next participant as their target
      type Participant = (typeof game.participants)[number];
      const sortedParticipants: Participant[] = [];

      // Find the first alive participant
      let current = game.participants.find((p) => !p.timeOfDeath);

      if (!current) {
        return game;
      }

      for (const _ of game.participants) {
        sortedParticipants.push(current);
        const newParticipant = game.participants.find(
          (p) => current?.target?.id === p.id,
        );
        if (!newParticipant) {
          throw new Error('Could not find next participant');
        }
        if (sortedParticipants.includes(newParticipant)) {
          break;
        }
        current = newParticipant;
      }

      // Now add all dead participants to the end of the list, sorted by time of death
      for (const p of game.participants
        .filter((p) => p.timeOfDeath)
        .sort(
          (a, b) =>
            (a.timeOfDeath?.getTime() ?? 0) - (b.timeOfDeath?.getTime() ?? 0),
        )) {
        sortedParticipants.push(p);
      }

      return {
        ...game,
        participants: sortedParticipants,
      };
    }),

  gameExists: protectedProcedure.query(async ({ ctx }) => {
    const date = new Date();
    const game = await ctx.prisma.killerGame.findFirst({
      where: {
        start: {
          lte: dayjs(date).add(2, 'week').toDate(),
        },
        end: {
          gte: dayjs(date).subtract(1, 'week').toDate(),
        },
      },
    });
    return {
      exists: !!game,
      start: game?.start,
    };
  }),

  getOwnPlayerInfo: protectedProcedure.query(async ({ ctx }) => {
    const date = new Date();
    const corpsId = ctx.session.user.corps.id;
    const player = await ctx.prisma.killerPlayer.findFirst({
      include: {
        corps: true,
        game: true,
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
      where: {
        corps: {
          id: corpsId,
        },
        game: {
          start: {
            lte: dayjs(date).add(2, 'week').toDate(),
          },
          end: {
            gte: dayjs(date).subtract(1, 'week').toDate(),
          },
        },
      },
    });
    return player;
  }),

  getCurrentGameInfo: protectedProcedure.mutation(async ({ ctx }) => {
    const date = new Date();
    const game = await ctx.prisma.killerGame.findFirst({
      include: {
        participants: {
          include: {
            corps: true,
          },
        },
      },
      where: {
        start: {
          lte: dayjs(date).add(2, 'week').toDate(),
        },
        end: {
          gte: dayjs(date).subtract(1, 'week').toDate(),
        },
      },
    });

    if (!game) {
      return null;
    }

    // If the game has started and the targets have not been assigned, shuffle the participants and connect them to their targets
    if (
      game.start.getTime() < date.getTime() &&
      game.participants.every((p) => p.targetId === null)
    ) {
      const shuffledParticipants = game.participants.sort(
        () => Math.random() - 0.5,
      );

      const usedWords: string[] = [];

      // Connect each participant to the next participant as their target
      await ctx.prisma.$transaction(
        shuffledParticipants.map((participant, index) => {
          // If we have run out of words, just pick a random one

          // const gameWords =
          //   usedWords.length < WORDS.length
          //     ? WORDS.filter((word) => !usedWords.includes(word.sv))
          //     : WORDS;
          const gameWords = game.participants
            .filter(
              (participant) =>
                !usedWords.includes(numberAndFullName(participant.corps)),
            )
            .map(
              (participant) =>
                ({
                  sv: numberAndFullName(participant.corps),
                  en: numberAndFullName(participant.corps),
                }) as Word,
            );

          const word = gameWords[Math.floor(Math.random() * gameWords.length)];
          if (!word) {
            throw Error(
              "Error when picking random word. This shouldn't be possible.",
            );
          }
          usedWords.push(word.sv);
          return ctx.prisma.killerPlayer.update({
            where: {
              id: participant.id,
            },
            data: {
              target: {
                connect: {
                  id:
                    shuffledParticipants[
                      (index + 1) % shuffledParticipants.length
                    ]?.id || 0,
                },
              },
              word: word.sv,
              wordEnglish: word.en,
            },
          });
        }),
      );
    }

    return game;
  }),

  create: restrictedProcedure('manageKiller')
    .input(
      z.object({
        name: z.string(),
        start: z.date(),
        end: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.killerGame.create({
        data: {
          name: input.name,
          start: input.start,
          end: input.end,
        },
        include: {
          participants: true,
        },
      });

      return res;
    }),

  remove: restrictedProcedure('manageKiller')
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.killerGame.delete({
        where: {
          id: input.id,
        },
      });

      return {
        success: true,
      };
    }),

  addParticipant: protectedProcedure
    .input(z.object({ corpsId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const date = new Date();
      const game = await ctx.prisma.killerGame.findFirst({
        where: {
          start: {
            gte: date,
          },
        },
        include: {
          participants: {
            include: {
              corps: true,
            },
          },
        },
      });

      if (!game) {
        throw new Error("No game which hasn't begun available");
      }

      // If no corpsId is supplied, register yourself
      const corpsId = input.corpsId ?? ctx.session.user.corps.id;

      const usedWords = game.participants.map(
        (participant) => participant.word,
      );
      // const gameWords = WORDS.filter((word) => !usedWords.includes(word.sv));
      const gameWords = game.participants
        .filter(
          (participant) =>
            !usedWords.includes(numberAndFullName(participant.corps)),
        )
        .map(
          (participant) =>
            ({
              sv: numberAndFullName(participant.corps),
              en: numberAndFullName(participant.corps),
            }) as Word,
        );
      if (gameWords.length === 0) {
        const firstWord = WORDS[0];
        if (firstWord) {
          gameWords.push(firstWord);
        }
      }

      const word = gameWords[Math.floor(Math.random() * gameWords.length)];
      if (!word) {
        throw Error(
          "Error when picking random word. This shouldn't be possible.",
        );
      }

      const participant = await ctx.prisma.killerPlayer.create({
        data: {
          game: {
            connect: {
              id: game.id,
            },
          },
          corps: {
            connect: {
              id: corpsId,
            },
          },
          word: word.sv,
          wordEnglish: word.en,
        },
      });
      return participant;
    }),

  removeParticipant: protectedProcedure
    .input(z.object({ killerId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.killerPlayer.delete({
        where: {
          id: input.killerId,
        },
      });

      return {
        success: true,
      };
    }),

  kill: protectedProcedure
    .input(
      z.object({
        word: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Remove p.e. or number in front of word to make that part non-mandatory
      const word = input.word
        .toLowerCase()
        .replace(/^(p\.e\.)/, '')
        .replace(/^#\d*/, '')
        .trim();

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
      const killer = await ctx.prisma.killerPlayer.findFirst({
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

      const svWord = killer.target?.target?.word
        .toLowerCase()
        .replace(/^(p\.e\.)/, '')
        .replace(/^#\d*/, '')
        .trim();
      const enWord = killer.target?.target?.wordEnglish
        .toLowerCase()
        .replace(/^(p\.e\.)/, '')
        .replace(/^#\d*/, '')
        .trim();
      if (!svWord || !enWord) {
        throw new Error('No word for your target found');
      }

      if (svWord !== word && enWord !== word) {
        return {
          success: false,
          message: 'Fel ord',
        };
      }

      // Find the corps which the user is trying to kill, and set their time of death
      await ctx.prisma.killerPlayer.update({
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
      await ctx.prisma.killerPlayer.update({
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
