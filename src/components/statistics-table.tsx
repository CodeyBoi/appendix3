import { Divider } from '@mantine/core';
import { IconMoodNerd } from '@tabler/icons';
import Link from 'next/link';
import React from 'react';
import { trpc } from '../utils/trpc';
import AlertError from './alert-error';
import Button from './button';
import Loading from './loading';

interface StatisticsTableProps {
  start: Date;
  end: Date;
}

const StatisticsTable = ({ start, end }: StatisticsTableProps) => {
  const { data: stats, status: statsStatus } = trpc.stats.get.useQuery({
    start,
    end,
  });
  const { nbrOfGigs, positivelyCountedGigs, corpsStats, corpsIds } =
    stats ?? {};

  const { data: corps } = trpc.corps.getSelf.useQuery();

  const { data: corpsPoints } = trpc.stats.getManyPoints.useQuery(
    { corpsIds },
    { enabled: !!corpsIds },
  );

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

  if (!corpsStats || !corpsPoints) {
    return <Loading msg='Laddar statistik...' />;
  }

  if (statsStatus === 'error') {
    return <AlertError msg='Kunde inte hämta spelningsstatistik.' />;
  }

  let lastAttendence = -516.0;

  return (
    <>
      {corpsIds && corpsIds.length === 0 && (
        <div>Det finns inga statistikuppgifter för denna period.</div>
      )}
      {corpsIds && corpsIds.length !== 0 && corpsPoints && corpsStats && (
        <div className='flex flex-col gap-2'>
          <div>
            {nbrOfGigsString + (nbrOfGigs !== 0 ? positiveGigsString : '')}
          </div>
          {ownPointsString && <div>{ownPointsString}</div>}
          <table className='divide-y divide-solid'>
            <thead>
              <tr>
                <th>#</th>
                <th className='text-left'>Namn</th>
                <th className='px-1 text-center'>Poäng</th>
                <th className='px-1 text-center'>Närvaro</th>
                <th className='px-1 text-center'>Totala poäng</th>
              </tr>
            </thead>
            <tbody className='text-sm divide-y divide-solid'>
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
                          <Divider
                            color='red'
                            label='Nummer'
                            labelPosition='center'
                          />
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className='py-1 pr-2 text-right'>
                        {stat.number ?? 'p.e.'}
                      </td>
                      <td>{`${stat.displayName}`}</td>
                      <td className='text-center'>{stat.gigsAttended}</td>
                      <td
                        align='center'
                        style={{ paddingLeft: '0px' }}
                      >{`${Math.ceil(stat.attendence * 100)}%`}</td>
                      <td align='center'>{corpsPoints.points[id]}</td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div className='h-96' />
          <Link href='/stats/for/nerds'>
            <div className='flex justify-center'>
              <Button leftSection={<IconMoodNerd />}>
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
