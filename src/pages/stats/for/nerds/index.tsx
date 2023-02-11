import React from 'react';
import { Stack, Title, Text } from '@mantine/core';
import { trpc } from '../../../../utils/trpc';
import { getOperatingYear } from '../../[paramYear]/index';

const encouragements = [
  'Ni är verkligen ett bra team!',
  'Ni är guld och gröna skogar!',
  'Ni är guld värda!',
  'Ni är bäst!',
  'Ni är bäst i stan!',
  'Ni är helt fantastiska!',
  'Ni är helt underbara!',
  'Ni är cracked!',
  'Ni är helt cracked!',
  'Ni är HELT cracked!',
  'Ni är motsatsen till dåliga!',
  'Ni är motsatsen till tråkiga!',
  'Ni är motsatsen till washed!',
  'Ni är motsatsen till washed up!',
  'Ni är motsatsen till washed out!',
  'Ni sätter standarden!',
  'Ni är standarden!',
  'Ni är standarden för hur det ska vara!',
  'Ni är standarden för hur det ska vara i corpset!',
  'Ni är standarden för hur det ska vara i corpsvärlden!',
  'Ni flyger högt!',
  'Ni flyger högre än högt!',
  'Ni flyger högre än träblåset!',
  'Ni rullar högt!',
  'Ni spelar högt!',
  'Ni är högt över medel!',
  'Ni är högt över snittet!',
  'Ni är den dynamiskaste av duos!',
  'Ni är hammen till den andras burgare!',
  'Ni är mjölken till den andras kaffe!',
  'Ni är kaffet till den andras mjölk!',
  'Ni är de vita prickarna till den andras röda bakgrund!',
  'Ni är Rick till den andras Morty!',
  'Ni är hornen till den andras Bleck!',
  'Ni är ginen till den andras tonic!',
  'Ni är colan till den andras rom!',
  'Ni är red-bullen till den andras vodka!',
  'Ni är alkoholen till den andras alkolås!',
  'Ni är alkoholen till den andras alkoholism!',
  'Är det inte vackert när två corps älskar varandra?',
  'Ni är en riktig power-duo!',
  'Ni är ett riktigt power-couple!',
  'Ni är ett riktigt power-team!',
  'Corpset är så glada att ni finns!',
  'Corpset ser fram emot att få se er fler gånger!',
  'Corpset hoppas på att se er fler gånger!',
  'Corpset hoppas på att få se er fler gånger!',
  'Corpset ser dig.',
  'Corpset älskar dig.',
  'Corpset ser dig. Corpset älskar dig.',
  'Corpset ser er.',
  'Corpset älskar er.',
  'Corpset ser er. Corpset älskar er.',
  'Corpset ser er. Corpset älskar er. Corpset vill se er fler gånger.',
  'Corpset ser er. Corpset älskar er. Corpset vill se er fler gånger. Corpset vill se er mer.',
  'Corpset vägrar föreställa sig corpset utan er!',
  'Corpset observerar era karriärer med stolthet!',
  'Corpset observerar era karriärer med stort intresse!',
  'Corpset observerar era karriärer med stor glädje!',
  'Corpset är stolta över er!',
  'Ni är starkare tillsammans!',
  'Ni är en enastående duo!',
  'Ni har en unik relation!',
  'Ni är ett vinnande team!',
  'Ni gör varandra bättre!',
  'Ni har en stark koppling!',
  'Ni är en stark duo!',
  'Ni har en mäktig kraft som ett par!',
  'Ni har en framtid full av möjligheter tillsammans!',
];

const hash = (str: string) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (((hash << 5) + hash) + str.charCodeAt(i)) % 0x1000000000000;
  }
  return hash;
};

const getEncouragement = (corpsId1: string, corpsId2: string) => {
  const combinedIndex = corpsId1 > corpsId2 ? corpsId1 + corpsId2 : corpsId2 + corpsId1;
  return encouragements[hash(combinedIndex) % encouragements.length];
};

const StatsForNerds = () => {
  const operatingYear = getOperatingYear();
  const { data: self } = trpc.corps.getSelf.useQuery();
 
  const start = new Date(operatingYear, 8, 1);
  const end = new Date(operatingYear + 1, 7, 31);
  const { data: corpsRelations } = trpc.stats.getCorpsBuddy.useQuery({ start, end });
  const { corpsBuddy, corpsEnemy } = corpsRelations ?? {};

  const corpsBuddyName = `${
    corpsBuddy?.number !== null ? '#' + corpsBuddy?.number.toString() : 'p.e. '
  } ${corpsBuddy?.firstName} ${corpsBuddy?.lastName}`;
  const corpsEnemyName = `${
    corpsEnemy?.number !== null ? '#' + corpsEnemy?.number.toString() : 'p.e. '
  } ${corpsEnemy?.firstName} ${corpsEnemy?.lastName}`;

  const encouragement = getEncouragement(self?.id ?? '', corpsBuddy?.corpsId ?? '');

  const corpsBuddyText = `Din corpsbästis för året är ${
    corpsBuddyName
  } med hela ${
    corpsBuddy?.commonGigs
  } gemensamma spelningar! ${encouragement}`;

  const corpsEnemyText = `Du och ${corpsEnemyName} har dock ${corpsEnemy?.commonGigs === 0
    ? 'inte varit på en enda spelning'
    : `bara varit på ${corpsEnemy?.commonGigs} ${(corpsEnemy?.commonGigs ?? 2) > 1    
      ? 'spelningar'
      : 'spelning'}`} tillsammans. Försöker ni undvika varandra?`;

  return (
    <Stack sx={{ maxWidth: 700 }}>
      <Title order={2}>Statistik för nördar</Title>
      <Stack>
        <Stack>
          <Title order={3}>Personlig statistik</Title>
          <Text>
            {corpsBuddy && `${corpsBuddyText} ${corpsEnemy && corpsEnemyText}`}
            <br />
          </Text>
        </Stack>
        <Stack>
          <Title order={3}>Allmän statistik</Title>
        </Stack>
      </Stack>
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
