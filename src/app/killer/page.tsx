import { Metadata } from 'next';
import { api } from 'trpc/server';
import { sortCorps } from 'utils/corps';
import { hashString } from 'utils/hash';

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
  'blev borttagen',
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
    <div className='flex flex-col'>
      <h1>Killer</h1>
      <h3>Corps</h3>
      <div className='text-lg'>
        <table className='dark:border-neutral-700'>
          <tbody className='text-sm dark:border-neutral-700'>
            {aliveParticipants.map((p) => (
              <tr key={p.corps.id}>
                <td className='pr-2 text-right'>
                  {p.corps.number ? '#' + p.corps.number.toString() : 'p.e.'}
                </td>
                <td>{p.corps.fullName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Corpses</h3>
        <table>
          {/* <thead>
            <tr>
              <th className='text-left'>Namn</th>
              <th className='text-left'>Dog</th>
            </tr>
          </thead> */}
          <tbody className='text-sm dark:border-neutral-700'>
            {deadParticipants.map((participant) => (
              <tr key={participant.id}>
                <td className='pr-4 line-through'>{`${
                  participant.corps.number
                    ? '#' + participant.corps.number.toString()
                    : 'p.e.'
                } ${participant.corps.displayName}`}</td>
                <td className='pr-1 text-right'>
                  {getDeathEuphemism(participant.corps)}
                </td>
                <td>
                  {participant.timeOfDeath?.toLocaleDateString('sv-SE', {
                    weekday: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
            {/* {killerGame?.participants.map((p) => (
              <tr key={p.corps.id}>
                <td>{p.corps.fullName}</td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KillerPage;
