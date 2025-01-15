'use client';

import { lang } from 'utils/language';

interface TimeProps {
  date: Date;
  options?: Intl.DateTimeFormatOptions;
}

const Time = ({ date, options }: TimeProps) => {
  const svTime = date.toLocaleDateString('sv', options);
  const enTime = date.toLocaleDateString('en', options);
  return <time dateTime={date.toISOString()}>{lang(svTime, enTime)}</time>;
};

export default Time;
