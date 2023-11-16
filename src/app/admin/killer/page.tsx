import { IconPlus } from '@tabler/icons-react';
import Button from 'components/input/button';
import dayjs from 'dayjs';
import { api } from 'trpc/server';

const AdminKillerPage = async () => {
  const game = await api.killer.get.query({});
  if (!game) {
    return <div>Ingen pågående killer</div>;
  }

  return (
    <div className='flex flex-col gap-2'>
      <Button href='/admin/killer/new'>
        <IconPlus />
        Skapa ny
      </Button>
      <table className='table'>
        <thead>
          <tr className='text-xs'>
            <th>KID</th>
            <th>Namn</th>
            <th>Ord</th>
            <th>Ord (en)</th>
            <th>Mål ID</th>
            <th>ToD</th>
            <th>killedBy</th>
          </tr>
        </thead>
        <tbody>
          {game?.participants.map((p) => {
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminKillerPage;
