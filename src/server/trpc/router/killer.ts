import dayjs from 'dayjs';
import { router, protectedProcedure, adminProcedure } from '../trpc';
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
              lte: dayjs(date).add(1, 'day').toDate(),
            },
            end: {
              gte: dayjs(date).subtract(1, 'week').toDate(),
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
      include: {
        participants: {
          include: {
            corps: true,
          },
        },
      },
      where: {
        start: {
          lte: dayjs(date).add(1, 'day').toDate(),
        },
        end: {
          gte: dayjs(date).subtract(1, 'week').toDate(),
        },
      },
    });

    if (!game) {
      return null;
    }

    const player = await ctx.prisma.killerCorps.findFirst({
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

    return {
      player,
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
