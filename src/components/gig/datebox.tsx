import React from 'react';
import { lang } from 'utils/language';

interface DateboxProps {
  date: Date;
}

const Datebox = ({ date }: DateboxProps) => {
  const month = date.toLocaleDateString('sv', { month: 'short' }).slice(0, 3);
  const weekday = date
    .toLocaleDateString('sv', { weekday: 'short' })
    .slice(0, 3);
  const monthEn = date.toLocaleDateString('en', { month: 'short' }).slice(0, 3);
  const weekdayEn = date
    .toLocaleDateString('en', { weekday: 'short' })
    .slice(0, 3);
  return (
    <div
      className='flex h-min w-16 flex-col rounded border border-black text-center'
      style={{ boxShadow: '2px 3px #888888' }}
    >
      <div className='bg-red-600 pt-0.5 text-xs font-light uppercase text-white'>
        {lang(month, monthEn)}
      </div>
      <div className='bg-red-600 font-castelar text-4xl text-white'>
        {date.getDate()}
      </div>
      <div className='bg-neutral-300 uppercase text-black'>
        {lang(weekday, weekdayEn)}
      </div>
    </div>
  );
};

export default Datebox;
