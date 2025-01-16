'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { lang } from 'utils/language';

interface CountdownProps {
  end: Date;
  className?: string;
}

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
    msg += `${minutes} minut${minutes === 1 ? '' : 'er'} `;
  }
  if (msg.length > 0) {
    msg += 'och ';
  }
  const seconds = Math.floor((secs / 1000) % 60);
  msg += `${seconds} sekund${seconds === 1 ? '' : 'er'}`;
  return msg;
};

const genTimeMsgEn = (secs: number) => {
  let msg = '';
  const days = Math.floor(secs / (1000 * 60 * 60 * 24));
  if (days > 0) {
    msg += `${days} day${days === 1 ? '' : 's'} `;
  }
  const hours = Math.floor((secs / (1000 * 60 * 60)) % 24);
  if (hours > 0) {
    msg += `${hours} hour${hours === 1 ? '' : 's'} `;
  }
  const minutes = Math.floor((secs / (1000 * 60)) % 60);
  if (minutes > 0) {
    msg += `${minutes} minute${minutes === 1 ? '' : 's'} `;
  }
  if (msg.length > 0) {
    msg += 'and ';
  }
  const seconds = Math.floor((secs / 1000) % 60);
  msg += `${seconds} second${seconds === 1 ? '' : 's'}`;
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
    return () => {
      clearInterval(interval);
    };
  }, [end]);

  useEffect(() => {
    if (!refreshed && timeLeft <= 0) {
      setRefreshed(true);
      router.refresh();
    }
  }, [timeLeft, router, refreshed]);

  return (
    <span className={className}>
      {lang(genTimeMsg(timeLeft), genTimeMsgEn(timeLeft))}
    </span>
  );
};

export default Countdown;
