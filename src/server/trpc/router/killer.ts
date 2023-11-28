import dayjs from 'dayjs';
import { router, protectedProcedure, restrictedProcedure } from '../trpc';
import { z } from 'zod';

type Word = {
  sv: string;
  en: string;
};

export const WORDS: Word[] = [
  { sv: 'akademiker', en: 'academics' },
  { sv: 'alligator', en: 'alligator' },
  { sv: 'analfabet', en: 'illiterate' },
  { sv: 'ananas', en: 'pineapple' },
  { sv: 'arbetsplats', en: 'workplace' },
  { sv: 'askkopp', en: 'ashtray' },
  { sv: 'badboll', en: 'beach ball' },
  { sv: 'badrumsgolv', en: 'bathroom floor' },
  { sv: 'bagare', en: 'baker' },
  { sv: 'bakelse', en: 'pastry' },
  { sv: 'bibliotek', en: 'library' },
  { sv: 'bieffekt', en: 'side effect' },
  { sv: 'bokhylla', en: 'bookshelf' },
  { sv: 'brevbärare', en: 'postman' },
  { sv: 'brevlåda', en: 'mailbox' },
  { sv: 'brottsling', en: 'criminal' },
  { sv: 'brottsplats', en: 'crime scene' },
  { sv: 'bältdjur', en: 'armadillo' },
  { sv: 'cigarett', en: 'cigarette' },
  { sv: 'clown', en: 'clown' },
  { sv: 'dagisbarn', en: 'children' },
  { sv: 'dammsugare', en: 'vacuum cleaner' },
  { sv: 'diarré', en: 'diarrhea' },
  { sv: 'dinosaurie', en: 'dinosaur' },
  { sv: 'dromedar', en: 'dromedary' },
  { sv: 'duschdraperi', en: 'shower curtain' },
  { sv: 'elefant', en: 'elephant' },
  { sv: 'fax', en: 'fax' },
  { sv: 'fotboll', en: 'football' },
  { sv: 'frimärke', en: 'stamp' },
  { sv: 'frisör', en: 'hairdresser' },
  { sv: 'fyrverkeri', en: 'fireworks' },
  { sv: 'fågelholk', en: 'birdhouse' },
  { sv: 'fågelskrämma', en: 'scarecrow' },
  { sv: 'försäkring', en: 'insurance' },
  { sv: 'gaffatejp', en: 'duct tape' },
  { sv: 'guacamole', en: 'guacamole' },
  { sv: 'halsband', en: 'necklace' },
  { sv: 'hammare', en: 'hammer' },
  { sv: 'hårdrock', en: 'hard rock' },
  { sv: 'häftstift', en: 'thumbtack' },
  { sv: 'hästsvans', en: 'ponytail' },
  { sv: 'hörselskydd', en: 'ear protection' },
  { sv: 'italienare', en: 'Italian' },
  { sv: 'journalist', en: 'journalist' },
  { sv: 'kaffekvarn', en: 'coffee grinder' },
  { sv: 'kapitel', en: 'chapter' },
  { sv: 'killergame', en: 'killer game' },
  { sv: 'kjol', en: 'skirt' },
  { sv: 'kofot', en: 'crowbar' },
  { sv: 'kokbok', en: 'cookbook' },
  { sv: 'kollega', en: 'colleague' },
  { sv: 'krokodil', en: 'crocodile' },
  { sv: 'kupong', en: 'coupon' },
  { sv: 'kurragömma', en: 'hide and seek' },
  { sv: 'kvadratmeter', en: 'square meter' },
  { sv: 'källare', en: 'basement' },
  { sv: 'känguru', en: 'kangaroo' },
  { sv: 'lejon', en: 'lion' },
  { sv: 'madrass', en: 'mattress' },
  { sv: 'margarin', en: 'margarine' },
  { sv: 'missförstånd', en: 'misunderstanding' },
  { sv: 'misstag', en: 'mistake' },
  { sv: 'morgonrock', en: 'housecoat' },
  { sv: 'noshörning', en: 'rhinoceros' },
  { sv: 'nätverk', en: 'network' },
  { sv: 'ordbank', en: 'vocabulary' },
  { sv: 'pennvässare', en: 'pencil sharpener' },
  { sv: 'påskhare', en: 'easter bunny' },
  { sv: 'räkning', en: 'bill' },
  { sv: 'saltkar', en: 'salt shaker' },
  { sv: 'schampo', en: 'shampoo' },
  { sv: 'shoppingcenter', en: 'shopping center' },
  { sv: 'silvertejp', en: 'duct tape' },
  { sv: 'sjukhus', en: 'hospital' },
  { sv: 'sjuksköterska', en: 'nurse' },
  { sv: 'skolbänk', en: 'school desk' },
  { sv: 'skruvmejsel', en: 'screwdriver' },
  { sv: 'skräckfilm', en: 'horror movie' },
  { sv: 'skådespelare', en: 'actor' },
  { sv: 'snowboard', en: 'snowboard' },
  { sv: 'spiraltrappa', en: 'spiral staircase' },
  { sv: 'stadsbuss', en: 'city ​​bus' },
  { sv: 'strykbräde', en: 'ironing board' },
  { sv: 'taklampa', en: 'ceiling lamp' },
  { sv: 'tandborste', en: 'toothbrush' },
  { sv: 'tandkräm', en: 'toothpaste' },
  { sv: 'tandläkare', en: 'dentist' },
  { sv: 'tandpetare', en: 'toothpick' },
  { sv: 'tandställning', en: 'braces' },
  { sv: 'tandtråd', en: 'dental floss' },
  { sv: 'telefonsvarare', en: 'answering machine' },
  { sv: 'termometer', en: 'thermometer' },
  { sv: 'tiger', en: 'tiger' },
  { sv: 'toalettpapper', en: 'toilet paper' },
  { sv: 'torkskåp', en: 'drying cabinet' },
  { sv: 'torktumlare', en: 'dryer' },
  { sv: 'tsatsiki', en: 'tzatziki' },
  { sv: 'tuggummi', en: 'chewing gum' },
  { sv: 'tunnelbana', en: 'subway' },
  { sv: 'turist', en: 'tourist' },
  { sv: 'tvättstuga', en: 'laundry' },
  { sv: 'tvättställ', en: 'sink' },
  { sv: 'tågstation', en: 'train station' },
  { sv: 'tändsticka', en: 'match' },
  { sv: 'vardagsrum', en: 'living room' },
  { sv: 'varm choklad', en: 'hot chocolate' },
  { sv: 'vattenfall', en: 'waterfall' },
  { sv: 'vattenkokare', en: 'kettle' },
  { sv: 'vattenmelon', en: 'watermelon' },
  { sv: 'vattenpistol', en: 'water gun' },
  { sv: 'vårdcentral', en: 'health center' },
  { sv: 'vårdnadshavare', en: 'caregiver' },
  { sv: 'återvinning', en: 'recycling' },
  { sv: 'öken', en: 'desert' },
  { sv: 'önskelista', en: 'wish list' },
  { sv: 'örngott', en: 'pillowcase' },
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
        // timeOfDeath cannot be null as we filter out those participants above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .sort((a, b) => a.timeOfDeath!.getTime() - b.timeOfDeath!.getTime())) {
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

      // Connect each participant to the next participant as their target
      await ctx.prisma.$transaction(
        shuffledParticipants.map((participant, index) =>
          ctx.prisma.killerPlayer.update({
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
            },
          }),
        ),
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
          participants: true,
        },
      });

      if (!game) {
        throw new Error("No game which hasn't begun available");
      }

      // If no corpsId is supplied, register yourself
      const corpsId = input.corpsId ?? ctx.session.user.corps.id;

      const usedWords =
        game.participants.map((participant) => participant.word) ?? [];
      const gameWords = WORDS.filter((word) => !usedWords.includes(word.sv));
      const word = gameWords[
        Math.floor(Math.random() * gameWords.length)
      ] as Word;

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
