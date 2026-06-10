'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { lang } from 'utils/language';

interface CountdownProps {
  end: Date;
  className?: string;
  currentDate?: Date;
}

const genTimeMsg = (mSecs: number) => {
  const days = Math.floor(mSecs / (1000 * 60 * 60 * 24));
  if (days > 0) {
    return `${days} dag${days === 1 ? '' : 'ar'} `;
  }
  const hours = Math.floor((mSecs / (1000 * 60 * 60)) % 24);
  if (hours > 0) {
    return `${hours} timm${hours === 1 ? 'e' : 'ar'} `;
  }
  const minutes = Math.floor((mSecs / (1000 * 60)) % 60);
  if (minutes > 0) {
    return `${minutes} minut${minutes === 1 ? '' : 'er'} `;
  }
  const seconds = Math.floor((mSecs / 1000) % 60);
  return `${seconds} sekund${seconds === 1 ? '' : 'er'}`;
};

const genTimeMsgEn = (mSecs: number) => {
  const days = Math.floor(mSecs / (1000 * 60 * 60 * 24));
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} `;
  }
  const hours = Math.floor((mSecs / (1000 * 60 * 60)) % 24);
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} `;
  }
  const minutes = Math.floor((mSecs / (1000 * 60)) % 60);
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} `;
  }
  const seconds = Math.floor((mSecs / 1000) % 60);
  return `${seconds} second${seconds === 1 ? '' : 's'}`;
};

const getTimeToNextUpdate = (mSecs: number) => {
  if (mSecs < 1000 * 60) {
    return mSecs % 1000;
  } else if (mSecs < 1000 * 60 * 60) {
    return mSecs % (1000 * 60);
  } else if (mSecs < 1000 * 60 * 60 * 24) {
    return mSecs % (1000 * 60 * 60);
  } else {
    return mSecs % (1000 * 60 * 60 * 24);
  }
};

const Countdown = ({
  end,
  className,
  currentDate = new Date(),
}: CountdownProps) => {
  const router = useRouter();
  const startDuration = end.getTime() - currentDate.getTime();
  const [timeLeft, setTimeLeft] = useState(startDuration);
  const [refreshed, setRefreshed] = useState(false);

  const updateFunc = () => {
    const now = new Date().getTime();
    const newTimeLeft = Math.max(0, end.getTime() - now);
    setTimeLeft(newTimeLeft);
    if (now > end.getTime()) {
      return;
    }
    setTimeout(
      updateFunc,
      getTimeToNextUpdate(Math.max(0, end.getTime() - new Date().getTime())),
    );
  };

  useEffect(() => {
    updateFunc();
  }, []);

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
