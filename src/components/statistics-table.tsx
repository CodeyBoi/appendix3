import * as React from 'react';
import { DataGrid, GridColDef, GridRowParams, GridSortModel  } from '@mui/x-data-grid';
import { ThemeProvider, createTheme, styled } from '@mui/material';
import Box from '@mui/material/Box';
import { Button, Stack, Text } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconMoodNerd } from '@tabler/icons';
import { trpc } from '../utils/trpc';
import AlertError from './alert-error';
import Loading from './loading';
import styles from '../styles/statistics-table.module.css';

interface StatisticsTableProps {
  start: Date;
  end: Date;
}

const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff',
    },
  },
});

const columns: GridColDef[] = [
  { field: 'id', headerName: 'id', width: 0 },
  { field: 'number', headerName: '#', width: 55 },
  { field: 'name', headerName: 'Namn', flex: 1 },
  { field: 'points', headerName: 'Poäng', type: 'number', width: 91 },
  { field: 'attendance', headerName: 'Närvaro', width: 100 },
  { field: 'totalPoints', headerName: 'Totala Poäng', type: 'number', width: 150 },
];

const StatisticsTable = ({ start, end }: StatisticsTableProps) => {
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'number',
      sort: 'asc',
    },
  ]);
  const { data: stats, status: statsStatus } = trpc.stats.get.useQuery({ start, end, });
  const { nbrOfGigs, positivelyCountedGigs, corpsStats, corpsIds } = stats ?? {};
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const { data: corpsPoints } = trpc.stats.getManyPoints.useQuery({ corpsIds }, { enabled: !!corpsIds });

  if (!corpsStats || !corpsPoints) {
    return <Loading msg='Laddar statistik...' />;
  }
  if (statsStatus === 'error') {
    return <AlertError msg='Kunde inte hämta spelningsstatistik.' />;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isNow = today <= end;

  const nbrOfGigsString = nbrOfGigs !== 0
    ? `Denna period ${isNow ? 'har vi hittills haft' : 'hade vi'} ${nbrOfGigs} spelning${nbrOfGigs === 1 ? '' : 'ar'}` : '';
  const positiveGigsString = (positivelyCountedGigs ?? 0) > 0
    ? `, där ${positivelyCountedGigs} ${isNow ? 'räknats' : 'räknades'} positivt.` : '.';
  const ownPoints = corps && stats ? stats.corpsStats[corps.id]?.gigsAttended : undefined;
  const ownAttendence = corps && stats ? stats.corpsStats[corps.id]?.attendence : undefined;
  // Somehow ownPoints is a string, so == is used instead of ===setSortColumn
  const ownPointsString = ownPoints && ownAttendence && nbrOfGigs !== 0
    ? `Du ${isNow ? 'har varit' : 'var'} med på ${ownPoints} spelning${ownPoints == 1 ? '' : 'ar'
    }, vilket ${isNow ? 'motsvarar' : 'motsvarade'} ${Math.round(ownAttendence * 100,)}% närvaro.`
    : undefined;

  const corpsIdsSorted = corpsIds?.sort((a, b) => {
    const aStat = corpsStats[a];
    const bStat = corpsStats[b];
    if (!aStat || !bStat) return 0;
    if (Math.ceil(aStat.attendence * 100) === Math.ceil(bStat.attendence * 100)) {
      return bStat.gigsAttended - aStat.gigsAttended;
    }
    return bStat.attendence - aStat.attendence;
  });
  if (corpsIdsSorted === undefined || corpsIds === undefined) {
    return <AlertError msg='Kunde inte hämta spelningsstatistik.' />;
  }

  const rows = corpsIdsSorted.map((corpsId) => {
    const stat = corpsStats[corpsId];
    if (!stat) return null;
    return {
      id: stat.id,
      number: stat.number ?? 'p.e.',
      name: `${stat.firstName} ${stat.lastName}`,
      points: stat.gigsAttended,
      attendance: `${Math.round(stat.attendence * 100)}%`,
      totalPoints: corpsPoints.points[corpsId]
    };
  });

  const statisticsTableStyle = (params: GridRowParams<any>) => {
    const isLastRowWithAgeAbove30 = rows.slice(params.row.rowIndex, params.row.rowIndex + 2)
    if (parseInt(params.row.attendance, 10) >= 75) {
      return 'fjång';
    }
    else if (parseInt(params.row.attendance, 10) >= 50) {
      return 'member';
    }
    return '';
  };

  const sortComparator = (v1: any, v2: any, cellParams1: any, cellParams2: any) => {
    if (typeof v1 === 'number' && typeof v2 === 'number') {
      return v1 - v2;
    } else if (typeof v1 === 'string' && typeof v2 === 'string') {
      return v1.localeCompare(v2);
    } else if (typeof v1 === 'number') {
      return -1;
    } else if (typeof v2 === 'number') {
      return 1;
    }
    return 0;
  };
  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };


  return (
    <>{corpsIds && corpsIds.length === 0 && (<Text>Det finns inga statistikuppgifter för denna period.</Text>)}
      {corpsPoints && corpsStats && corpsIdsSorted && corpsIdsSorted.length !== 0 && (
        <Stack>
          <Text>
            {nbrOfGigsString + (nbrOfGigs !== 0 ? positiveGigsString : '')}
          </Text>
          {ownPointsString && <Text>{ownPointsString}</Text>}
          <ThemeProvider theme={theme}>
            <div style={{ height: '100%', width: '100%' }}>
              <Box
                sx={{
                  '& .fjång': {
                    backgroundColor: '#90EE90',
                  },
                  '& .member': {
                    backgroundColor: '#FFCCCB',
                  }
                }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  /*initialState={{
                    sorting: {
                      sortModel: [{ field: 'attendance', sort: 'desc' }],
                    },
                  }}*/
                  sortingOrder={['desc', 'asc']}
                  sortModel={sortModel}
                  onSortModelChange={handleSortModelChange}
                  sortComparator={sortComparator}
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  disableColumnMenu
                  disableColumnFilter
                  disableColumnSelector
                  columnVisibilityModel={{
                    id: false,
                  }}
                  getRowClassName={statisticsTableStyle}
                />
              </Box>
            </div>
          </ThemeProvider>
          <Button
            component={NextLink}
            href='/stats/for/nerds'
            leftIcon={<IconMoodNerd />}
          >
            Statistik för nördar
          </Button>
        </Stack>)}</>
  );
}

export default StatisticsTable;