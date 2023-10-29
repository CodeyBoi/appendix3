import { IconMoodNerd } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';
import Button from 'components/input/button';
import { api } from 'trpc/server';
import CorpsDisplay from 'components/corps/display';

interface StatisticsTableProps {
  start: Date;
  end: Date;
}

const StatisticsTable = async ({ start, end }: StatisticsTableProps) => {
  const stats = await api.stats.get.query({
    start,
    end,
  });
  const { nbrOfGigs, positivelyCountedGigs, corpsStats, corpsIds } =
    stats ?? {};

  const corps = await api.corps.getSelf.query();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isNow = today <= end;

  const nbrOfGigsString =
    nbrOfGigs !== 0
      ? `Denna period ${
          isNow ? 'har vi hittills haft' : 'hade vi'
        } ${nbrOfGigs} spelning${nbrOfGigs === 1 ? '' : 'ar'}`
      : '';
  const positiveGigsString =
    (positivelyCountedGigs ?? 0) > 0
      ? `, där ${positivelyCountedGigs} ${
          isNow ? 'räknats' : 'räknades'
        } positivt.`
      : '.';

  const ownPoints =
    corps && stats ? stats.corpsStats[corps.id]?.gigsAttended : undefined;
  const ownAttendence =
    corps && stats ? stats.corpsStats[corps.id]?.attendence : undefined;
  // Somehow ownPoints is a string, so == is used instead of ===
  const ownPointsString =
    ownPoints && ownAttendence && nbrOfGigs !== 0
      ? `Du ${isNow ? 'har varit' : 'var'} med på ${ownPoints} spelning${
          ownPoints == 1 ? '' : 'ar'
        }, vilket ${isNow ? 'motsvarar' : 'motsvarade'} ${Math.ceil(
          ownAttendence * 100,
        )}% närvaro.`
      : undefined;

  let lastAttendence = -516.0;

  return (
    <>
      {corpsIds && corpsIds.length === 0 && (
        <div>Det finns inga statistikuppgifter för denna period.</div>
      )}
      {corpsIds && corpsIds.length !== 0 && corpsStats && (
        <div className='flex flex-col gap-2'>
          <div>
            {nbrOfGigsString + (nbrOfGigs !== 0 ? positiveGigsString : '')}
          </div>
          {ownPointsString && <div>{ownPointsString}</div>}
          <table className='divide-y divide-solid dark:border-neutral-700'>
            <thead>
              <tr>
                <th className='text-left'>Namn</th>
                <th className='px-1 text-center'>Poäng</th>
                <th className='px-1 text-center'>Närvaro</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-solid text-sm dark:border-neutral-700'>
              {corpsIds.map((id) => {
                const stat = corpsStats[id];
                if (!stat) return null;
                // let addFjangDivider = false;
                let addMemberDivider = false;
                // if (Math.ceil(lastAttendence * 100) >= 100 && Math.ceil(stat.attendence * 100) < 100) {
                //   addFjangDivider = true;
                // }
                if (
                  Math.ceil(lastAttendence * 100) >= 50 &&
                  Math.ceil(stat.attendence * 100) < 50
                ) {
                  addMemberDivider = true;
                }
                lastAttendence = stat.attendence;
                return (
                  <React.Fragment key={stat.id}>
                    {/* {addFjangDivider && (
                      <tr style={{ border: '0' }}>
                        <td colSpan={5} style={{ textAlign: 'center' }}>
                          <Divider
                            color='red'
                            label='Fjång'
                            labelPosition='center'
                          />
                        </td>
                      </tr>
                    )} */}
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
              })}
            </tbody>
          </table>
          <div className='h-96' />
          <Link href='/stats/for/nerds'>
            <div className='flex justify-center'>
              <Button>
                <IconMoodNerd />
                Statistik för nördar
              </Button>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default StatisticsTable;
