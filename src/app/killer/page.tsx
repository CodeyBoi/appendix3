import { Metadata } from 'next';
import { api } from 'trpc/server';

export const metadata: Metadata = {
  title: 'Killer',
};

const KillerPage = async () => {
  const killerGame = await api.killer.get.query({ id: '1' });

  return (
    <div>
      <h1>Corps & Corpses</h1>
      <div className='text-lg'>
        <table className='divide-y divide-solid dark:border-neutral-700'>
          <thead>
            <tr>
              <th className='text-left'>Namn</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-solid text-sm dark:border-neutral-700'>
            {killerGame?.participants.map((p) => (
              <tr key={p.corps.id}>
                <td>{p.corps.fullName}</td>
              </tr>
            ))
            /* {corpsIds.map((id) => {
              const stat = corpsStats[id];
              if (!stat) return null;
  
              let addMemberDivider = false;
   
              if (
                Math.ceil(lastAttendence * 100) >= 50 &&
                Math.ceil(stat.attendence * 100) < 50
              ) {
                addMemberDivider = true;
              }
              lastAttendence = stat.attendence;
              return (
                <React.Fragment key={stat.id}>

                  {addMemberDivider && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center' }}>
                        <div className='flex flex-nowrap items-center py-1'>
                          <div className='h-px grow bg-red-600' />
                          <div className='px-2 text-xs text-red-600'>
                            Nummer
                          </div>
                          <div className='h-px grow bg-red-600' />
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className='py-1'>
                      <CorpsDisplay corps={stat} />
                    </td>
                    <td className='text-center'>{stat.gigsAttended}</td>
                    <td
                      align='center'
                      style={{ paddingLeft: '0px' }}
                    >{`${Math.ceil(stat.attendence * 100)}%`}</td>
                  </tr>
                </React.Fragment>
              );
            })} */
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KillerPage;
