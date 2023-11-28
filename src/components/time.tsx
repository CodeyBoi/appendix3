'use client';

import useLanguage from 'hooks/use-language';

type TimeProps = {
  date: Date;
  options?: Intl.DateTimeFormatOptions;
};

const Time = ({ date, options }: TimeProps) => {
  const { language } = useLanguage();
  const time = date.toLocaleDateString(language, options);
  return <time dateTime={date.toISOString()}>{time}</time>;
};

export default Time;
