'use client';

import Head from 'next/head';
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { getOperatingYear } from 'utils/date';
import { trpc } from '../utils/trpc';

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

interface PersonalStatsProps {
  operatingYear?: number;
}

const hash = (str: string) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return Math.abs(hash);
};

const getEncouragement = (corpsId1: string, corpsId2: string) => {
  const combinedIndex =
    corpsId1 > corpsId2 ? corpsId1 + corpsId2 : corpsId2 + corpsId1;
  return encouragements[hash(combinedIndex) % encouragements.length];
};

const PersonalStats = ({
  operatingYear = getOperatingYear(),
}: PersonalStatsProps) => {
  const { data: self } = trpc.corps.getSelf.useQuery();
  const { data: pentagon } = trpc.stats.getPentagon.useQuery();

  const statPoints = useMemo(
    () => [
      {
        name: 'Attack',
        value: pentagon?.attack.toFixed(1) ?? 0,
      },
      {
        name: 'Styrka',
        value: pentagon?.strength.toFixed(1) ?? 0,
      },
      {
        name: 'Uthållighet',
        value: pentagon?.endurance.toFixed(1) ?? 0,
      },
      {
        name: 'Tagg',
        value: pentagon?.hype.toFixed(1) ?? 0,
      },
      {
        name: 'Pålitlighet',
        value: pentagon?.reliability.toFixed(1) ?? 0,
      },
    ],
    [pentagon],
  );

  const start = new Date(operatingYear, 8, 1);
  const end = new Date(operatingYear + 1, 7, 31);
  const { data: corpsRelations } = trpc.stats.getCorpsBuddy.useQuery({
    start,
    end,
  });
  const { corpsBuddy, corpsEnemy } = corpsRelations ?? {};

  const { data: monthlyStats } = trpc.stats.getMonthly.useQuery({
    start: new Date(2010, 0, 1),
    end,
  });

  const { data: career } = trpc.stats.getCareer.useQuery();
  const { joined, points, rehearsals } = career ?? {};
  const joinedText = joined?.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const careerText =
    joined && points !== undefined && rehearsals !== undefined
      ? `Sedan du gick med i corpset den ${joinedText} har du varit med på ${rehearsals} rep och samlat ihop ${points} spelpoäng. Sick!`
      : '';

  const chartData = useMemo(
    () =>
      monthlyStats?.map((item) => ({
        name: `${item.month
          .toLocaleDateString('sv-SE', { month: 'short' })
          .slice(0, 3)
          .toUpperCase()} ${item.month.getFullYear()}`,
        points: item.points,
        maxGigs: item.maxGigs,
      })),
    [monthlyStats],
  );

  const corpsBuddyName = `${
    corpsBuddy && corpsBuddy.number !== null
      ? '#' + corpsBuddy.number.toString()
      : 'p.e. '
  } ${corpsBuddy?.firstName} ${corpsBuddy?.lastName}`;
  const corpsEnemyName = `${
    corpsEnemy && corpsEnemy.number !== null
      ? '#' + corpsEnemy.number.toString()
      : 'p.e. '
  } ${corpsEnemy?.firstName} ${corpsEnemy?.lastName}`;

  const encouragement = getEncouragement(
    self?.id ?? '',
    corpsBuddy?.corpsId ?? '',
  );

  const corpsBuddyText = `Din corpsbästis för året är ${corpsBuddyName} med hela ${corpsBuddy?.commonGigs} gemensamma spelningar! ${encouragement}`;

  const corpsEnemyText = `Du och ${corpsEnemyName} har dock ${
    corpsEnemy?.commonGigs === 0
      ? 'inte varit på en enda spelning'
      : `bara varit på ${corpsEnemy?.commonGigs} ${
          (corpsEnemy?.commonGigs ?? 2) > 1 ? 'spelningar' : 'spelning'
        }`
  } tillsammans. Försöker ni undvika varandra?`;

  const avgSignupDelayDays = Math.trunc(pentagon?.avgSignupDelay ?? 0);
  const attackDaysText =
    avgSignupDelayDays === 0
      ? 'samma dag'
      : avgSignupDelayDays === 1
      ? 'nästa dag'
      : `efter ${avgSignupDelayDays} dagar`;
  const attackText = `Attack är hur snabbt du anmäler dig till nya spelningar. När en spelning dykt upp i blindtarmen är du i snitt på hugget med en anmälan ${attackDaysText}!`;

  const strengthText = `Styrka är inte implementerat än lol. Just nu är det bara snittet av de andra fyra. Maila förslag pls.`;

  const enduranceText = `Uthållighet baseras på din längsta streak bland de senaste spelningarna. För dig är det ${pentagon?.longestStreak} spelningar i rad!`;

  const hypeText = `Tagg är hur taggad du varit på sistone, och du har varit ${Math.trunc(
    (pentagon?.hype ?? 0) * 10,
  )}% taggad på sistone!`;

  const avgSignupChangeHours = Math.trunc(
    (pentagon?.avgSignupChange ?? 0) * 24,
  );
  const avgSignupChangeText =
    avgSignupChangeHours < 4
      ? 'inte ändra i din anmälan alls efteråt! Sekreteraren tackar dig för att du står för det du säger!'
      : `ändra din anmälan i snitt ${avgSignupChangeHours} timmar efteråt. Bättre kan du!`;
  const reliabilityText = `Pålitlighet är hur mycket man kan lita på dig. Efter att du anmält dig brukar du ${avgSignupChangeText}`;

  return (
    <div className='flex max-w-4xl flex-col text-base'>
      <Head>
        <title>Statistik för nördar</title>
      </Head>
      <h2>Statistik för nördar</h2>
      <div className='flex flex-col gap-2'>
        <div>
          <h3>Din corpscarriär</h3>
          {careerText}
        </div>
        <div className='flex flex-col gap-4'>
          <div className='text-center'>
            <h4>Graf över hur cool du varit från månad till månad 😎</h4>
          </div>
          <ResponsiveContainer width='100%' height={150}>
            <AreaChart data={chartData} style={{ marginLeft: '-35px' }}>
              <Area
                name='Dina spelningar'
                type='monotone'
                dataKey='points'
                stroke='none'
                fill={'#ce0c00'}
                fillOpacity={0.9}
              />
              <Area
                name='Corpsets spelningar'
                type='monotone'
                dataKey='maxGigs'
                stroke={'#ce0c00'}
                strokeDasharray='3 3'
                fill='none'
              />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
          {pentagon && (
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              <div>
                <h3>Dina corpsegenskaper 📋</h3>
                {[
                  attackText,
                  strengthText,
                  enduranceText,
                  hypeText,
                  reliabilityText,
                ].join(' ')}
              </div>
              <ResponsiveContainer width='100%' height={210}>
                <RadarChart outerRadius={80} data={statPoints}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey='name' />
                  <PolarRadiusAxis domain={[0, 10]} stroke='none' />
                  <Radar
                    name='Poäng'
                    dataKey='value'
                    stroke={'#ce0c00'}
                    fill={'#ce0c00'}
                    fillOpacity={0.6}
                    dot={true}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
          {(corpsBuddy || corpsEnemy) && (
            <div>
              <h4>Corpsbästis 😇🤝😇 och corpssämstis 😱</h4>
              {corpsBuddy &&
                `${corpsBuddyText} ${corpsEnemy && corpsEnemyText}`}
            </div>
          )}
        </div>
        <h3>Allmän statistik</h3>
      </div>
      <i>
        <b>DENNA SIDA ÄR UNDER KONSTRUKTION. SNART I EN BLINDTARM NÄRA DIG!</b>
        <br />
        (har du några förslag på vad som skulle kunna finnas på denna sida?
        skicka ett mail till{' '}
        <a style={{ color: 'blue' }} href='mailto:itk@bleckhornen.org'>
          <u>itk@bleckhornen.org</u>
        </a>
        )
      </i>
    </div>
  );
};

export default PersonalStats;
