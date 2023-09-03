import { Button, Divider, Stack, Table, Text } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconMoodNerd } from '@tabler/icons';
import React from 'react';
import { trpc } from '../utils/trpc';
import AlertError from './alert-error';
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

  let lastAttendence = 1.0;

  return (
    <>
      {corpsIds && corpsIds.length === 0 && (
        <Text>Det finns inga statistikuppgifter för denna period.</Text>
      )}
      {corpsIds && corpsIds.length !== 0 && corpsPoints && corpsStats && (
        <Stack>
          <Text>
            {nbrOfGigsString + (nbrOfGigs !== 0 ? positiveGigsString : '')}
          </Text>
          {ownPointsString && <Text>{ownPointsString}</Text>}
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Namn</th>
                <th style={{ textAlign: 'center', paddingLeft: '0px' }}>
                  Poäng
                </th>
                <th style={{ textAlign: 'center', paddingLeft: '0px' }}>
                  Närvaro
                </th>
                <th
                  style={{
                    textAlign: 'center',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                  }}
                >
                  Totala poäng
                </th>
              </tr>
            </thead>
            <tbody>
              {corpsIds.map((id) => {
                const stat = corpsStats[id];
                if (!stat) return null;
                let addFjangDivider = false;
                let addMemberDivider = false;
                if (lastAttendence >= 1 && stat.attendence < 1) {
                  addFjangDivider = true;
                }
                if (lastAttendence >= 0.5 && stat.attendence < 0.5) {
                  addMemberDivider = true;
                }
                lastAttendence = stat.attendence;
                return (
                  <React.Fragment key={stat.id}>
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
                    <tr key={id}>
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
                      >{`${Math.ceil(stat.attendence * 100)}%`}</td>
                      <td align='center'>{corpsPoints.points[id]}</td>
                    </tr>
                  </React.Fragment>
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
