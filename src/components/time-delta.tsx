'use client';

import { Language } from 'hooks/use-language';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { lang } from 'utils/language';

type TimeGranularity = 'year' | 'day' | 'hour' | 'minute' | 'second';

interface CountdownProps {
  time: Date;
  className?: string;
  refreshOnEnd?: boolean;
  currentDate?: Date;
  minGranularity?: TimeGranularity;
}

const genMsgLang = (lang: Language) => (msgs: string[]) => {
  if (msgs.length === 0) {
    return '';
  } else if (msgs.length === 1) {
    return msgs[0] ?? '';
  } else {
    return `${msgs.slice(0, -1).join(', ')} ${lang === 'sv' ? 'och' : 'and'} ${
      msgs[msgs.length - 1]
    }`;
  }
};

const genTimeMsg = (millis: number, minUnit: TimeGranularity) => {
  const genMsg = genMsgLang('sv');
  const msgs: string[] = [];

  const years = Math.floor(millis / (1000 * 60 * 60 * 24 * 365));
  if (years > 0) {
    msgs.push(`${years} år`);
  }
  if (minUnit === 'year') {
    return genMsg(msgs);
  }

  const days = Math.floor((millis / (1000 * 60 * 60 * 24)) % 365);
  if (days > 0) {
    msgs.push(`${days} dag${days === 1 ? '' : 'ar'}`);
  }
  if (minUnit === 'day') {
    return genMsg(msgs);
  }

  const hours = Math.floor((millis / (1000 * 60 * 60)) % 24);
  if (hours > 0) {
    msgs.push(`${hours} timm${hours === 1 ? 'e' : 'ar'}`);
  }
  if (minUnit === 'hour') {
    return genMsg(msgs);
  }

  const minutes = Math.floor((millis / (1000 * 60)) % 60);
  if (minutes > 0) {
    msgs.push(`${minutes} minut${minutes === 1 ? '' : 'er'}`);
  }
  if (minUnit === 'minute') {
    return genMsg(msgs);
  }

  const seconds = Math.floor((millis / 1000) % 60);
  msgs.push(`${seconds} sekund${seconds === 1 ? '' : 'er'}`);
  return genMsg(msgs);
};

const genTimeMsgEn = (millis: number, minUnit: TimeGranularity) => {
  const genMsg = genMsgLang('en');
  const msgs: string[] = [];

  const years = Math.floor(millis / (1000 * 60 * 60 * 24 * 365));
  if (years > 0) {
    msgs.push(`${years} year${years === 1} ? '' : 's'`);
  }
  if (minUnit === 'year') {
    return genMsg(msgs);
  }

  const days = Math.floor((millis / (1000 * 60 * 60 * 24)) % 365);
  if (days > 0) {
    msgs.push(`${days} day${days === 1 ? '' : 's'}`);
  }
  if (minUnit === 'day') {
    return genMsg(msgs);
  }

  const hours = Math.floor((millis / (1000 * 60 * 60)) % 24);
  if (hours > 0) {
    msgs.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  }
  if (minUnit === 'hour') {
    return genMsg(msgs);
  }

  const minutes = Math.floor((millis / (1000 * 60)) % 60);
  if (minutes > 0) {
    msgs.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  }
  if (minUnit === 'minute') {
    return genMsg(msgs);
  }

  const seconds = Math.floor((millis / 1000) % 60);
  msgs.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
  return genMsg(msgs);
};

const TimeDelta = ({
  time,
  className,
  refreshOnEnd = false,
  currentDate = new Date(),
  minGranularity = 'second',
}: CountdownProps) => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(
    Math.abs(currentDate.getTime() - time.getTime()),
  );
  const [shouldRefresh, setShouldRefresh] = useState(refreshOnEnd);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(Math.abs(time.getTime() - new Date().getTime()));
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  useEffect(() => {
    if (shouldRefresh && seconds === 0) {
      setShouldRefresh(false);
      router.refresh();
    }
  }, [seconds, router, shouldRefresh]);

  return (
    <span className={className}>
      {lang(
        genTimeMsg(seconds, minGranularity),
        genTimeMsgEn(seconds, minGranularity),
      )}
    </span>
  );
};

export default TimeDelta;
