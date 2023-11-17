'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type CountdownProps = {
  end: Date;
  className?: string;
};

const genTimeMsg = (secs: number) => {
  let msg = '';
  const days = Math.floor(secs / (1000 * 60 * 60 * 24));
  if (days > 0) {
    msg += `${days} dag${days === 1 ? '' : 'ar'} `;
  }
  const hours = Math.floor((secs / (1000 * 60 * 60)) % 24);
  if (hours > 0) {
    msg += `${hours} timm${hours === 1 ? 'e' : 'ar'} `;
  }
  const minutes = Math.floor((secs / (1000 * 60)) % 60);
  if (minutes > 0) {
    msg += `${minutes} minut${minutes === 1 ? '' : 'er'} och `;
  }
  const seconds = Math.floor((secs / 1000) % 60);
  msg += `${seconds} sekund${seconds === 1 ? '' : 'er'}`;
  return msg;
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

  return <span className={className}>{genTimeMsg(timeLeft)}</span>;
};

export default Countdown;
