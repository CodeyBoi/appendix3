import { Metadata } from 'next';
import { api } from 'trpc/server';

export const metadata: Metadata = {
  title: 'Killer',
};

const KillerPage = async () => {
  const killerGame = await api.killer.getCurrentInfo.query();

  if (!killerGame) {
    return <div>Ingen pågående killer (för dig i alla fall)</div>;
  }

  const killsMsg = `Du har utfört ${
    killerGame.killer.kills.length
  } mord på följande personer:\n${killerGame.killer.kills
    .flatMap((p) => (p.timeOfDeath !== null ? [p.corps.fullName] : []))
    .join('\n')}`;

  return (
    <div>
      <h1>Corps(es)</h1>
      <div className='text-lg'>
        <table className='divide-y divide-solid dark:border-neutral-700'>
          <thead>
            <tr>
              <th className='text-left'>Namn</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-solid text-sm dark:border-neutral-700'>
            {killsMsg.split('\n').map((line) => (
              <tr key={line}>
                <td>{line}</td>
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
