import { IconDownload, IconPlus } from '@tabler/icons-react';
import Button from 'components/input/button';
import dayjs from 'dayjs';
import { api } from 'trpc/server';
import KillerDeletePlayer from './delete-player';
import KillerAddPlayer from './add-player';
import KillerControl from './control';

const AdminKillerPage = async () => {
  const corps = await api.corps.getSelf.query();
  if (corps.id !== 'cld099pna01uxzhvdgs1u95oc') {
    return <div>Detta får bara Cool-Hannes se :) (get fucked)</div>;
  }

  const game = await api.killer.get.query({});

  const date = new Date();
  const hasStarted = game && date > game.start;

  const participantsCsvLink =
    'data:text/csv;charset=utf-8,Mål,Ord\n' +
    encodeURIComponent(
      game?.participants
        .map(
          (p) =>
            `${p.corps.number ? '#' + p.corps.number.toString() : 'p.e.'} ${
              p.corps.fullName
            },${p.word}/${p.wordEnglish}`,
        )
        .join('\n') ?? '',
    );

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row gap-2'>
        <Button href='/admin/killer/new'>
          <IconPlus />
          Skapa nytt spel
        </Button>
        {game && (
          <a href={participantsCsvLink} download={`Killer ${game.name}.csv`}>
            <Button>
              <IconDownload />
              Ladda ner som CSV
            </Button>
          </a>
        )}
      </div>
      {game ? (
        <>
          <KillerAddPlayer participants={game.participants} />
          <table className='table text-xs'>
            <thead>
              <tr className='text-left'>
                <th>PID</th>
                <th>Namn</th>
                <th>Ord</th>
                <th>Eng</th>
                <th>Mål</th>
                <th>ToD</th>
                <th>DödAv</th>
              </tr>
            </thead>
            <tbody>
              {game.participants.map((p) => {
                return (
                  <tr key={p.id}>
                    <td className='px-1'>{p.id}</td>
                    <td className='px-1'>{p.corps.fullName}</td>
                    <td className='px-1'>{p.word}</td>
                    <td className='px-1'>{p.wordEnglish}</td>
                    <td className='px-1'>{p.targetId}</td>
                    <td className='px-1'>
                      {p.timeOfDeath
                        ? dayjs(p.timeOfDeath).format('MM-DD HH:mm')
                        : ''}
                    </td>
                    <td className='px-1'>{p.killedById}</td>
                    {!hasStarted && (
                      <td className='px-1'>
                        <KillerDeletePlayer killerId={p.id} />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <KillerControl id={game.id} />
        </>
      ) : (
        <div>Ingen pågående killer</div>
      )}
    </div>
  );
};

export default AdminKillerPage;
