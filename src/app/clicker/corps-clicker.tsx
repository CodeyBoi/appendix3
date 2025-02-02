'use client';

import { IconDotsVertical } from '@tabler/icons-react';
import Datebox from 'components/gig/datebox';
import Button from 'components/input/button';
import SegmentedControl from 'components/input/segmented-control';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { range, sum } from 'utils/array';
import { lang } from 'utils/language';

type Upgrade =
  | 'pr'
  | 'board'
  | 'probationaryStudent'
  | 'timeMachine'
  | 'riotGig';

interface GameData {
  upgradeLevels: Record<Upgrade, number>;
  startDate: Date;
  daysPassed: number;
  points: number;
  totalPoints: number;
}

interface CorpsClickerProps {
  startDate?: Date;
  gameData: GameData;
}

interface Gig {
  id: number;
  onDay: number;
  meetup: string;
  start: string;
  type: string;
  signedUp: boolean;
}

const gigTypes = [
  'Pärmspelning!',
  'Marschspelning!',
  'Party-marsch-spelning!',
] as const;

const baseDaylength = 3000;

const baseUpgradeCosts: Record<Upgrade, number> = {
  pr: 10,
  probationaryStudent: 50,
  board: 100,
  riotGig: 200,
  timeMachine: 500,
};

const gigSpawnRange = {
  start: 5,
  end: 15,
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

const generateGigAttributes = () => {
  const hour = randomInt(15, 22);
  const minute = randomInt(1, 4) * 15;
  return {
    meetup: `${hour}:${minute}`,
    start: `${hour + 1}:${minute}`,
    type: gigTypes[randomInt(0, gigTypes.length)] ?? gigTypes[0],
  };
};

const gigProbability = (upgradeLevels: Record<Upgrade, number>) =>
  0.3 + upgradeLevels.board * 0.05;
const gigsPerDay = (upgradeLevels: Record<Upgrade, number>) =>
  1 + upgradeLevels.pr;
const gameSpeed = (upgradeLevels: Record<Upgrade, number>) =>
  1 + upgradeLevels.timeMachine * 0.05;
const pointsPerGig = (upgradeLevels: Record<Upgrade, number>) =>
  1 + upgradeLevels.riotGig;

const CorpsClicker = ({
  startDate = new Date(),
  gameData,
}: CorpsClickerProps) => {
  const [totalGigCount, setTotalGigCount] = useState(0);
  const [daysPassed, setDaysPassed] = useState(gameData.daysPassed);
  const [points, setPoints] = useState(gameData.points);
  const [gigs, setGigs] = useState<Gig[]>([]);

  const [upgradeLevels, setUpgradeLevels] = useState(gameData.upgradeLevels);

  const gameLoop = () => {
    const numberOfNewGigs = sum(
      range(gigsPerDay(upgradeLevels)).map(() =>
        Math.random() < gigProbability(upgradeLevels) ? 1 : 0,
      ),
    );
    const newGigs: Gig[] = [];
    for (let i = 0; i < numberOfNewGigs; i++) {
      newGigs.push({
        onDay: daysPassed + randomInt(gigSpawnRange.start, gigSpawnRange.end),
        id: totalGigCount + i + 1,
        signedUp: false,
        ...generateGigAttributes(),
      });
    }
    console.log({
      gigs,
      newGigs,
      daysPassed,
      totalGigCount,
    });

    setPoints(
      (p) =>
        p +
        gigs.filter((gig) => daysPassed === gig.onDay && gig.signedUp).length *
          pointsPerGig(upgradeLevels),
    );
    setGigs((prev) =>
      prev
        .filter((gig) => daysPassed < gig.onDay)
        .concat(newGigs)
        .sort((a, b) =>
          a.onDay !== b.onDay
            ? a.onDay - b.onDay
            : a.meetup.localeCompare(b.meetup),
        ),
    );
    setTotalGigCount((c) => c + newGigs.length);
    setDaysPassed((d) => d + 1);
  };

  const removeGig = (id: number) => {
    setGigs((prev) => prev.filter((gig) => gig.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        gameLoop();
      },
      baseDaylength / gameSpeed(upgradeLevels),
    );
    return () => {
      clearInterval(interval);
    };
  }, [daysPassed, gigs, totalGigCount]);

  return (
    <div className='flex max-w-4xl flex-col gap-4'>
      <h4>
        {lang('Spelpoäng: ', 'Gig points: ')}
        {points}
      </h4>
      <h5>
        {lang('Datum: ', 'Date: ')}
        {dayjs(startDate)
          .add(daysPassed, 'days')
          .locale('sv')
          .format('dddd, DD MMMM YYYY')}
      </h5>
      <div className='flex flex-col gap-2'>ADD UPGRADE BUTTONS</div>
      {gigs.map((gig) => (
        <div
          key={gig.id}
          className='flex flex-col gap-4 rounded border p-4 shadow-md'
        >
          <div className='flex flex-nowrap content-start justify-between'>
            <div className='my-1 h-6 w-72 rounded bg-gray-500/20' />
            <IconDotsVertical className='text-red-600' />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-nowrap items-start gap-4'>
              <Datebox
                date={dayjs(startDate).add(gig.onDay, 'days').toDate()}
              />
              <div className='text-xs leading-normal'>
                <i>{gig.type}</i>
                <br />
                {!!gig.meetup && lang('Samling: ', 'Gathering: ')}
                {gig.meetup}
                {!!gig.meetup && <br />}
                {!!gig.start && lang('Start: ', 'Start: ')}
                {gig.start}
              </div>
            </div>
          </div>
          <SegmentedControl
            options={[
              {
                label: lang('Ja', 'Yes'),
                value: 'yes',
              },
              {
                label: lang('Nej', 'No'),
                value: 'no',
              },
            ]}
            onChange={(value) => (gig.signedUp = value === 'yes')}
          />
        </div>
      ))}
    </div>
  );
};

export default CorpsClicker;
