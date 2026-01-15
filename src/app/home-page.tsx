import { Gig } from '@prisma/client';
import React, { Suspense } from 'react';
import GigCard from 'components/gig/card';
import GigSkeleton from 'components/gig/skeleton';
import { api } from 'trpc/server';
import { lang } from 'utils/language';
import { getAppendixAgeInDays, isAppendixBirthday } from 'utils/date';
import { APPENDIX_DEVELOPERS } from 'utils/corps';

const WIDTHS = [
  [200, 120, 95, 0.6],
  [110, 75, 70, 0.2],
  [235, 105, 95, 0.1],
  [145, 155, 135, 0.4],
];

const makeGigList = async (currentDate: Date) => {
  const [gigs, corps] = await Promise.all([
    api.gig.getMany.query({ startDate: currentDate }),
    api.corps.getSelf.query(),
  ]);

  if (gigs.length === 0) {
    return (
      <div className='flex flex-col gap-2 italic'>
        <h3 className='uppercase'>
          {lang('Här var det tomt...', 'This place is empty...')}
        </h3>
        <p>
          {lang(
            'Just nu finns det inga spelningar inplanerade.',
            'There are no upcoming gigs at the moment.',
          )}
        </p>
      </div>
    );
  }

  let lastMonth = -1;
  const gigsByMonth = gigs.reduce<
    (Gig & { type: { name: string } } & {
      hiddenFor: { corpsId: string }[];
    })[][]
  >((acc, gig) => {
    const month = gig.date.getMonth();
    const newMonth = month !== lastMonth;
    lastMonth = month;
    if (newMonth) {
      acc.push([]);
    }
    acc.at(-1)?.push(gig);
    return acc;
  }, []);

  const gigList = gigsByMonth.map((gigs) => {
    const gigDate = gigs[0]?.date;
    const month = gigDate?.toLocaleDateString(corps.language, {
      month: 'long',
    });
    const year = gigDate?.getFullYear();
    return (
      <React.Fragment key={`${month} ${year}`}>
        <h3>{`${month?.charAt(0).toUpperCase()}${month?.slice(1)}`}</h3>
        {gigs.map((gig) => (
          <GigCard key={gig.id} gig={gig} />
        ))}
      </React.Fragment>
    );
  });

  return gigList;
};

interface HomePageProps {
  currentDate?: Date;
}

const HomePage = async ({ currentDate = new Date() }: HomePageProps) => {
  const month = currentDate.toLocaleDateString('sv-SE', { month: 'long' });

  const [killerGame, killerPlayer, streaks, streckAccount] = await Promise.all([
    api.killer.gameExists.query(),
    api.killer.getOwnPlayerInfo.query(),
    api.stats.getStreak.query({}),
    api.streck.getOwnStreckAccount.query(),
  ]);

  const streak = streaks.streaks.get(streaks.corpsIds[0] ?? '') ?? 0;

  const hasntSignedUpForExistingKillerGame =
    killerGame.exists &&
    killerGame.start &&
    killerGame.start > currentDate &&
    !killerPlayer;

  const fire = '🔥'.repeat(Math.floor(streak / 10 + 1));

  return (
    <div className='flex max-w-4xl flex-col gap-4'>
      {hasntSignedUpForExistingKillerGame && (
        <div className='-mr-2 flex justify-end motion-safe:animate-bounce dark:text-darkText lg:hidden'>
          {lang('Anmäl dig till Killergame! ⬆️', 'Sign up for Killergame! ⬆️')}
        </div>
      )}
      {streckAccount.balance < 0 && (
        <div className='top-20 z-20 max-w-4xl rounded-lg bg-yellow p-4 text-center text-yellow-800 shadow-md'>
          <h3>
            {lang(
              `Vet din mamma om att ditt strecksaldo är negativt (${streckAccount.balance.toString()}p)? `,
              `Does your mother know your streck balance is negative (${streckAccount.balance.toString()}p)? `,
            )}
          </h3>
          <h5>
            {lang(
              `Ytterligare streck innan du gör en inbetalning kommer debiteras extra. `,
              `Further streck before settling your debt will be charged extra. `,
            )}
            {lang(
              `Betala till bankgiro 669-8567 eller swisha till 123-388 68 76.`,
              `Pay to bankgiro 669-8567 or swish to 123-388 68 76`,
            )}
          </h5>
        </div>
      )}
      {isAppendixBirthday(currentDate) && (
        <div className='top-20 z-20 max-w-4xl rounded-lg bg-yellow p-4 text-yellow-900 shadow-md'>
          <h2>
            🎂🎂
            {lang(
              `Idag fyller Blindtarmen ${Math.floor(
                getAppendixAgeInDays(currentDate) / 365,
              )} år!`,
              `Today Appendix turns ${Math.floor(
                getAppendixAgeInDays(currentDate) / 365,
              )} years old!`,
            )}
            🎂🎂
          </h2>
          <h5>
            {lang(
              `Låt oss under denna dag hedra dessa tappra själar som byggt denna sida från grunden:`,
              `Let us during this day honor these brave souls who built this webpage:`,
            )}
            <ul className='list-disc py-2 pl-6'>
              {APPENDIX_DEVELOPERS.map((name) => (
                <li>{name}</li>
              ))}
            </ul>
          </h5>
        </div>
      )}
      {streak >= 3 && streckAccount.balance >= 0 && (
        <div className='rounded-lg border bg-red-600 p-3 text-center text-lg text-white shadow-md'>
          {fire}
          {lang(
            ` Din spelningstreak är ${streak} `,
            ` Your gig streak is ${streak} `,
          )}
          {fire}
        </div>
      )}
      <Suspense
        fallback={
          <>
            <h3 className='max-h-max max-w-max rounded bg-gray-500/20 text-gray-500/0 first-letter:uppercase'>
              {month}
            </h3>
            <GigSkeleton widths={WIDTHS[0]} />
            <GigSkeleton widths={WIDTHS[1]} />
            <GigSkeleton widths={WIDTHS[2]} />
            <GigSkeleton widths={WIDTHS[3]} />
          </>
        }
      >
        {await makeGigList(currentDate)}
      </Suspense>
    </div>
  );
};

export default HomePage;
