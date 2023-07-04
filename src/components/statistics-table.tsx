import { Button, Divider, Stack, Table, Text } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconMoodNerd } from '@tabler/icons';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import AlertError from './alert-error';
import Loading from './loading';

interface StatisticsTableProps {
  start: Date;
  end: Date;
}

const StatisticsTable = ({ start, end }: StatisticsTableProps) => {

  const [sortColumn, setSortColumn] = useState('Närvaro');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

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
      ? `Denna period ${isNow ? 'har vi hittills haft' : 'hade vi'
      } ${nbrOfGigs} spelning${nbrOfGigs === 1 ? '' : 'ar'}`
      : '';
  const positiveGigsString =
    (positivelyCountedGigs ?? 0) > 0
      ? `, där ${positivelyCountedGigs} ${isNow ? 'räknats' : 'räknades'
      } positivt.`
      : '.';

  const ownPoints =
    corps && stats ? stats.corpsStats[corps.id]?.gigsAttended : undefined;
  const ownAttendence =
    corps && stats ? stats.corpsStats[corps.id]?.attendence : undefined;
  // Somehow ownPoints is a string, so == is used instead of ===setSortColumn
  const ownPointsString =
    ownPoints && ownAttendence && nbrOfGigs !== 0
      ? `Du ${isNow ? 'har varit' : 'var'} med på ${ownPoints} spelning${ownPoints == 1 ? '' : 'ar'
      }, vilket ${isNow ? 'motsvarar' : 'motsvarade'} ${Math.round(
        ownAttendence * 100,
      )}% närvaro.`
      : undefined;

  if (!corpsStats || !corpsPoints) {
    return <Loading msg='Laddar statistik...' />;
  }

  if (statsStatus === 'error') {
    return <AlertError msg='Kunde inte hämta spelningsstatistik.' />;
  }

  const corpsIdsSorted = corpsIds?.sort((a, b) => {
    if (sortColumn === "#") { 
      const aStat = corpsStats[a];
      const bStat = corpsStats[b];
      if (!aStat || !bStat) return 0;
      const anumber = aStat.number;
      const bnumber = bStat.number;
      if(anumber == null) return 1;
      if(bnumber == null) return -1;
      return bnumber - anumber;
    }
    else if (sortColumn === "Namn") {
      const aStat = corpsStats[a];
      const bStat = corpsStats[b];
      if (!aStat || !bStat) return 0;
      return aStat.lastName.localeCompare(bStat.lastName);
    } 
    else if (sortColumn === "Poäng") {
      const aStat = corpsStats[a];
      const bStat = corpsStats[b];
      if (!aStat || !bStat) return 0;
      if (bStat.gigsAttended === aStat.gigsAttended) {
        return bStat.attendence - aStat.attendence;
      }
      return bStat.gigsAttended - aStat.gigsAttended;
    }
    else if (sortColumn === "Totala Poäng") {
      const aPoints = corpsPoints.points[a];
      const bPoints = corpsPoints.points[b];
      if (!aPoints || !bPoints) return 0;
      return bPoints - aPoints;
    }     
    else if (sortColumn === "Närvaro") {
      const aStat = corpsStats[a];
      const bStat = corpsStats[b];
      if (!aStat || !bStat) return 0;
      if (Math.ceil(aStat.attendence * 100) === Math.ceil(bStat.attendence * 100)) {
      return bStat.gigsAttended - aStat.gigsAttended;
      }
    return bStat.attendence - aStat.attendence;
    } 
    const aStat = corpsStats[a];
    const bStat = corpsStats[b];
    if (!aStat || !bStat) return 0;
    if (Math.ceil(aStat.attendence * 100) === Math.ceil(bStat.attendence * 100)) {
      return bStat.gigsAttended - aStat.gigsAttended;
    }
    return bStat.attendence - aStat.attendence;
  });
  if (corpsIdsSorted !== undefined && sortDirection === 'desc') {
    corpsIdsSorted.reverse();
  }

  let lastAttendence = 1.0;

  return (
    <>
      {corpsIds && corpsIds.length === 0 && (
        <Text>Det finns inga statistikuppgifter för denna period.</Text>
      )}
      {corpsPoints &&
        corpsStats &&
        corpsIdsSorted &&
        corpsIdsSorted.length !== 0 && (
          <Stack>
            <Text>
              {nbrOfGigsString + (nbrOfGigs !== 0 ? positiveGigsString : '')}
            </Text>
            {ownPointsString && <Text>{ownPointsString}</Text>}
            <Table>
              <thead>
                <tr>
                  <th>
                    <button onClick={() => handleSort('#')}># </button> 
                  </th>
                  <th> 
                  <button onClick={() => handleSort('Namn')}>Namn </button>
                  </th>
                  <th style={{ textAlign: 'center', paddingLeft: '0px' }}> 
                  <button onClick={() => handleSort('poäng')}> Poäng </button>
                  </th>
                  <th style={{ textAlign: 'center', paddingLeft: '0px' }}>
                  <button onClick={() => handleSort('Närvaro')}> Närvaro </button>
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      paddingLeft: '0px',
                      paddingRight: '0px',
                    }}>
                    <button onClick={() => handleSort('Totala Poäng')}> Totala poäng </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {corpsIdsSorted.map((id) => {
                  const stat = corpsStats[id];
                  if (!stat) return null;
                  let addFjangDivider = false;
                  let addMemberDivider = false;
                  if (lastAttendence >= 0.75 && stat.attendence < 0.75 && sortColumn === "Närvaro") {
                    addFjangDivider = true;
                  }
                  if (lastAttendence >= 0.5 && stat.attendence < 0.5 && sortColumn === "Närvaro") {
                    addMemberDivider = true;
                  }
                  lastAttendence = stat.attendence;
                  return (
                    <>
                      {addFjangDivider && (
                        <tr style={{ border: '0' }}>
                          <td colSpan={5} style={{ textAlign: 'center' }}>
                            <Divider
                              color='red'
                              label='Fjång'
                              labelPosition='center'
                            />
                          </td>
                        </tr>
                      )}
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
                      <tr key={id} 
                          style={{
                          backgroundColor: stat.attendence >= 0.75 && sortColumn !== "Närvaro" ? 'rgb(152,251,152)'
                          : stat.attendence >= 0.5 && stat.attendence < 0.75 && sortColumn !== "Närvaro" ? 'rgb(233, 153, 149)'
                          : ''
                        }}>
                        <td
                          align='center'
                          style={{ paddingLeft: '0px', paddingRight: '0px' }}
                        >
                          {stat.number ?? 'p.e.'}
                        </td>
                        <td>{`${stat.firstName} ${stat.lastName}`}</td>
                        <td align='center' style={{ paddingLeft: '0px' }}>
                          {stat.gigsAttended}
                        </td>
                        <td
                          align='center'
                          style={{ paddingLeft: '0px' }}
                        >{`${Math.round(stat.attendence * 100)}%`}</td>
                        <td align='center'>{corpsPoints.points[id]}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>
            <Button
              component={NextLink}
              href='/stats/for/nerds'
              leftIcon={<IconMoodNerd />}
            >
              Statistik för nördar
            </Button>
          </Stack>
        )}
    </>
  );
};

export default StatisticsTable;
