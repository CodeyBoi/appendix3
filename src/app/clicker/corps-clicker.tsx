'use client'

import { IconDoor } from "@tabler/icons-react";
import Button from "components/input/button";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { lang } from "utils/language";

interface CorpsClickerProps {
  currentDate?: Date;
}

interface Gig {
  id: number;
  onDay: number;
}

const gigSpawnRange = {
  start: 5,
  end: 25,
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const CorpsClicker = ({ currentDate = new Date() }: CorpsClickerProps) => {
  const [totalGigCount, setTotalGigCount] = useState(0);
  const [daysPassed, setDaysPassed] = useState(0)
  const [points, setPoints] = useState(0);
  const [gigProbability, setGigProbability] = useState(0.2);
  const [gigs, setGigs] = useState<Gig[]>([]);

  const gameLoop = () => {
    const newGigs = gigs.filter((gig) => gig.onDay <= daysPassed);
    if (Math.random() < gigProbability) {
      newGigs.push({ onDay: daysPassed + randomInt(gigSpawnRange.start, gigSpawnRange.end), id: totalGigCount + 1 })
      setTotalGigCount((c) => c + 1)
    }
    console.log({
      gigs,
      newGigs,
      daysPassed,
      totalGigCount,

    })
    
    setDaysPassed((d) => d + 1)
    setGigs(newGigs);
  }

  const removeGig = (id: number) => {
    setGigs((prev) => prev.filter((gig) => gig.id !== id));
  }
  
  useEffect(() => {
    console.log('Running effect')
    const interval = setInterval(() => {
      gameLoop();
      console.log('Running loop')
    }, 3000);

    return () => {
      clearInterval(interval);
    }
  }, [daysPassed, gigs, totalGigCount])

  return (
    <div className="flex flex-col gap-4">
      <h4>{lang('Spelpoäng: ', 'Gig points: ')}{points}</h4>
      <h5>{lang('Datum: ', 'Date: ')}{dayjs(currentDate).add(daysPassed, 'days').locale('sv').format('dddd, DD MMMM YYYY')}</h5>

      {
      gigs.map((gig) => (
        <div className="rounded shadow-md border p-6">
          <h5>{dayjs(currentDate).add(gig.onDay, 'days').format('dddd, DD MMMM YYYY')}</h5>
      <Button
        key={gig.id}
        onClick={() => {
          setPoints(points + 1)
          removeGig(gig.id)
        }
      }
      >
        <IconDoor />
        {lang('Gå på spelning', 'Go to gig')}
      </Button>
      </div>
      ))
      
    }
    </div>
  )
}

export default CorpsClicker
