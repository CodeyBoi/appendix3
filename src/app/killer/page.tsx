import CorpsDisplay from 'components/corps/display';
import { Metadata } from 'next';
import { api } from 'trpc/server';
import { detailedName, sortCorps } from 'utils/corps';
import { hashString } from 'utils/hash';
import KillerWordForm from './word-form';

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
  const killerGame = await api.killer.getCurrentInfo.query();

  if (!killerGame) {
    return <div>Ingen pågående killer</div>;
  }

  const { game, player } = killerGame;
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        a.timeOfDeath!.getTime() - b.timeOfDeath!.getTime(),
    );

  return (
    <div className='flex max-w-5xl flex-col'>
      <h1>Killer</h1>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col'>
            <h3>{hasStarted ? 'Corps' : 'Anmälda corps'}</h3>
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
          {hasStarted && (
            <div className='flex flex-col'>
              <h3>Corpses</h3>
              <table>
                <tbody className='text-sm dark:border-neutral-700'>
                  {deadParticipants.length === 0 && (
                    <tr>
                      <i>Här kommer framtida vilsna själar listas...</i>
                    </tr>
                  )}
                  {deadParticipants.map((participant) => (
                    <tr key={participant.id}>
                      <td className='whitespace-nowrap pr-2 line-through'>
                        <CorpsDisplay corps={participant.corps} />
                      </td>
                      <td className='italic text-red-600'>
                        {getDeathEuphemism(participant.corps)}{' '}
                        {participant.timeOfDeath?.toLocaleDateString('sv-SE', {
                          weekday: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          {isParticipant &&
            hasStarted &&
            !hasEnded &&
            (isAlive && player.target ? (
              <>
                <h3>Du lever än!</h3>
                <div className='max-w-max rounded border border-gray-500 p-3 text-lg shadow'>
                  <div className='flex gap-2'>
                    Mål:
                    <CorpsDisplay corps={player.target.corps} />
                  </div>
                  <div className='flex gap-2'>
                    Ord:
                    <div>
                      {player.target.word}/{player.target.wordEnglish}
                    </div>
                  </div>
                </div>
                <KillerWordForm />
              </>
            ) : (
              <>
                <h3 className='text-red-600'>DU ÄR DÖD</h3>
                <div>{`Din livsglöd släcktes av ${detailedName(
                  player.killedBy?.corps,
                )} ${player.timeOfDeath?.toLocaleDateString('sv-SE', {
                  weekday: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}.`}</div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default KillerPage;
