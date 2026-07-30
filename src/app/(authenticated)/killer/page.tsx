import CorpsDisplay from 'components/corps/display';
import { Metadata } from 'next';
import { api } from 'trpc/server';
import { detailedName, sortCorps } from 'utils/corps';
import { hashString } from 'utils/hash';
import KillerWordForm from './word-form';
import KillerAddPlayer from '../admin/killer/add-player';
import Countdown from 'components/countdown';
import { IconInfoCircle } from '@tabler/icons-react';
import Button from 'components/input/button';
import { lang } from 'utils/language';
import Time from 'components/time';

export const metadata: Metadata = {
  title: 'Killer',
};

const DEATH_EUPHEMISMS = [
  'gick bort',
  'gick ur tiden',
  'gick vidare',
  'lämnade oss',
  'gick bort från oss',
  'sågs senast',
  'gick till Valhall',
  'upplevde ett tekniskt fel',
  'upplevde ett kritiskt systemfel',
  'blev av med livet',
  'somnade in',
  'gick till den stora serverhallen',
  'åkte till Belize',
  'åkte till Bahamas',
  'steg ifrån det jordliga planet',
  'började dansa med sirener',
  'dog',
  '404 not found since',
  'togs bort',
  'blev rekt',
  'blev pwned',
  'blev raderad',
  'åts upp (?)',
  'försvann',
  'exploderade',
  'gick på plankan',
  'gick på semester',
  'ragequittade',
  'försvann spårlöst',
  'blev bortrövad',
  'zombifierades',
  'kidnappades',
  'gick till AK',
  'omkom',
  'plockades bort',
  'blev bannad',
  'kixade',
  'intonerade sin sista pärmlåt',
  'sjöng Stad i ljus',
  'stängde schlagernatten',
  'började tänka på refrängen',
  'drack dödsglögg',
  'föll från balkongen',
  'skippade söndagsstädningen',
  'stack till Finland',
  'muckade med slagverket',
  'tog sitt sista andetag',
];

const getDeathEuphemism = (corps: {
  firstName: string;
  lastName: string;
  id: string;
}) => {
  const { id, firstName, lastName } = corps;
  if (
    firstName.trim().toLowerCase() === 'julia' &&
    lastName.trim().toLowerCase() === 'wallberg'
  ) {
    return 'kröp upp i sin röv och försvann';
  }
  return DEATH_EUPHEMISMS[hashString(id) % DEATH_EUPHEMISMS.length];
};

const KillerPage = async () => {
  const [corps, game, player, christmasConcert] = await Promise.all([
    api.corps.getSelf.query(),
    api.killer.getCurrentGameInfo.mutate(),
    api.killer.getOwnPlayerInfo.query(),
    api.gig.getChristmasConcert.query({}),
  ]);

  if (!game) {
    return <h2>{lang('Ingen pågående killer :(', 'No ongoing killer :(')}</h2>;
  }

  const isParticipant = player !== null;
  const isAlive = isParticipant && player.timeOfDeath === null;

  const hasStarted = game.start.getTime() < Date.now();
  const hasEnded = game.end.getTime() < Date.now();

  const aliveParticipants = game.participants
    .filter((p) => p.timeOfDeath === null)
    .sort((a, b) => sortCorps(a.corps, b.corps));
  const deadParticipants = game.participants
    .filter((p) => p.timeOfDeath !== null)
    .sort(
      (a, b) =>
        // timeOfDeath cannot be null as we filter out those participants above

        (a.timeOfDeath?.getTime() ?? 0) - (b.timeOfDeath?.getTime() ?? 0),
    );

  return (
    <div className='flex max-w-5xl flex-col'>
      {hasStarted && (
        <div className='flex flex-row flex-nowrap items-center'>
          <h1 className='grow'>Killer</h1>
          <Button href='/killer/rules'>
            <IconInfoCircle />
            {lang('Regler', 'Rules')}
          </Button>
        </div>
      )}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col'>
            {!hasStarted && (
              <div className='flex flex-col items-center'>
                <Button href='/killer/rules'>
                  <IconInfoCircle />
                  {lang(
                    'Vad i hela friden är detta?',
                    'What the heck is this?',
                  )}
                </Button>
                <div className='h-4' />
                <div className='flex flex-col items-center gap-2 text-center text-2xl font-bold italic text-red-600'>
                  {lang('Killergame börjar om', 'Killergame is starting in')}
                  <Countdown end={game.start} className='text-4xl' />
                  <span className='text-lg'>
                    {isParticipant ? (
                      lang(
                        'Du är anmäld! Lycka till! 🔪🔪🔪',
                        'You are signed up! Good luck! 🔪🔪🔪',
                      )
                    ) : (
                      <div className='animate-bounce'>
                        <div className='h-2' />
                        {lang(
                          '⬇️ Anmäl dig redan idag! ⬇️',
                          '⬇️ Sign up today! ⬇️',
                        )}
                        <div className='h-2' />
                      </div>
                    )}
                  </span>
                </div>
                {!isParticipant && (
                  <>
                    <KillerAddPlayer corpsId={corps.id} />
                  </>
                )}
                <div className='h-4' />
              </div>
            )}
            <div className='flex flex-col gap-4'>
              {hasStarted && (
                <div className='flex flex-col'>
                  <h3>Corpses</h3>
                  <table>
                    <tbody className='text-sm dark:border-neutral-700'>
                      {deadParticipants.length === 0 && (
                        <tr>
                          <td className='italic'>
                            {lang(
                              'Här kommer framtida vilsna själar listas...',
                              'Here, future lost souls will be listed...',
                            )}
                          </td>
                        </tr>
                      )}
                      {deadParticipants.map((participant) =>
                        participant.timeOfDeath ? (
                          <tr key={participant.id}>
                            <td className='whitespace-nowrap pr-2 line-through'>
                              <CorpsDisplay corps={participant.corps} />
                            </td>
                            <td className='italic text-red-600'>
                              {`sa "${
                                participant.word
                              }" och ${getDeathEuphemism(participant.corps)} `}
                              <Time
                                date={participant.timeOfDeath}
                                options={{
                                  weekday: 'long',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }}
                              />
                            </td>
                          </tr>
                        ) : null,
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              <div className='flex flex-col'>
                {game.participants.length > 0 && (
                  <h3>
                    {hasStarted
                      ? lang('Återstående corps', 'Remaining corps')
                      : lang('Anmälda corps', 'Registered corps')}
                  </h3>
                )}
                <table className='dark:border-neutral-700'>
                  <tbody className='text-sm dark:border-neutral-700'>
                    {aliveParticipants.map((p) => (
                      <tr key={p.corps.id}>
                        <td>
                          <CorpsDisplay corps={p.corps} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!hasStarted &&
                christmasConcert &&
                christmasConcert.signups.length > 0 && (
                  <div className='flex flex-col'>
                    <h5>
                      {lang(
                        'Stackars satar som kommer att ha en mycket tråkigare repvecka...',
                        'Poor souls who will have a very mundane rehearsal week...',
                      )}
                    </h5>
                    <table className='dark:border-neutral-700'>
                      <tbody className='text-sm dark:border-neutral-700 lg:text-right'>
                        {christmasConcert.signups.flatMap((signup) =>
                          game.participants.some(
                            (p) => p.corps.id === signup.corps.id,
                          )
                            ? []
                            : [
                                <tr key={signup.corps.id}>
                                  <td>
                                    <CorpsDisplay corps={signup.corps} />
                                  </td>
                                </tr>,
                              ],
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          {isParticipant &&
            hasStarted &&
            !hasEnded &&
            (isAlive && player.target ? (
              <>
                <h3>{lang('Du lever än!', 'You are still alive!')}</h3>
                <div className='flex gap-2'>
                  <div className='max-w-max rounded border border-gray-500 p-3 text-lg font-bold italic text-red-600 shadow'>
                    <div className='flex gap-2'>
                      {lang('Offer:', 'Target:')}
                      <CorpsDisplay
                        corps={player.target.corps}
                        nameFormat='full-name'
                      />
                    </div>
                    <div className='flex gap-2'>
                      {lang('Ord:', 'Word:')}
                      <div>{player.target.word}</div>
                    </div>
                  </div>
                </div>
                <KillerWordForm />
              </>
            ) : (
              <>
                <h3 className='uppercase text-red-600'>
                  {lang('Du är död', 'You are dead')}
                </h3>
                <div>
                  {lang(
                    'Din livsglöd släcktes av ',
                    'You were snuffed out by ',
                  )}
                  {`${detailedName(
                    player.killedBy?.corps,
                  )} ${player.timeOfDeath?.toLocaleDateString(corps.language, {
                    weekday: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}.`}
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default KillerPage;
