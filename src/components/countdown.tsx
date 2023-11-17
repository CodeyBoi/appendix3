'use client';

import { useEffect, useState } from 'react';

type CountdownProps = {
  end: Date;
  className?: string;
};

const Countdown = ({ end, className }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(
    end.getTime() - new Date().getTime(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(end.getTime() - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [end]);

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
