'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type CountdownProps = {
  end: Date;
  className?: string;
};

const Countdown = ({ end, className }: CountdownProps) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(
    end.getTime() - new Date().getTime(),
  );
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, end.getTime() - new Date().getTime()));
    }, 100);
    return () => clearInterval(interval);
  }, [end]);

  useEffect(() => {
    if (!refreshed && timeLeft <= 0) {
      setRefreshed(true);
      router.refresh();
    }
  }, [timeLeft, router, refreshed]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className={className}>
      {days} dagar {hours} timmar {minutes} minuter och {seconds} sekunder!
    </div>
  );
};

export default Countdown;
