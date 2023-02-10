import React from 'react';
import { Grid, Stack, Title, Text } from '@mantine/core';
import { trpc } from '../../../../utils/trpc';

const StatsForNerds = () => {
  const { data: corpsBuddy } = trpc.stats.getCorpsBuddy.useQuery();

  const corpsBuddyName = `${
    corpsBuddy?.number !== null ? '#' + corpsBuddy?.number.toString() : 'p.e. '
  } ${corpsBuddy?.firstName} ${corpsBuddy?.lastName}`;

  return (
    <Stack sx={{ maxWidth: 700 }}>
      <Title order={2}>Statistik för nördar</Title>
      <Grid>
        <Grid.Col span={12} md={6}>
          <Stack>
            <Title order={3}>Personlig statistik</Title>
            <Text>
              {corpsBuddy
                ? `Din corpsbästis är ${corpsBuddyName}! Ni har spelat tillsammans på hela ${corpsBuddy?.points} olika spelningar.`
                : null}{' '}
              <br />
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={12} md={6}>
          <Stack>
            <Title order={3}>Allmän statistik</Title>
          </Stack>
        </Grid.Col>
      </Grid>
      <Text>
        <i>
          <b>
            DENNA SIDA ÄR UNDER KONSTRUKTION. SNART I EN BLINDTARM NÄRA DIG!
          </b>
          <br />
          (har du några förslag på vad som skulle kunna finnas på denna sida?
          skicka ett mail till{' '}
          <a style={{ color: 'blue' }} href='mailto:itk@bleckhornen.org'>
            <u>itk@bleckhornen.org</u>
          </a>
          )
        </i>
      </Text>
    </Stack>
  );
};

export default StatsForNerds;