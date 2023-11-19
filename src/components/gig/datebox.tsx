import { Dayjs } from 'dayjs';
import React from 'react';
import { api } from 'trpc/server';

interface DateboxProps {
  date: Dayjs;
}

const Datebox = async ({ date }: DateboxProps) => {
  const language = await api.corps.getLanguage.query();
  return (
    <div
      className='flex h-min w-16 flex-col rounded border border-black text-center'
      style={{ boxShadow: '2px 3px #888888' }}
    >
      <div className='bg-red-600 pt-0.5 text-xs font-light uppercase text-white'>
        {date
          .toDate()
          .toLocaleDateString(language, { month: 'short' })
          .slice(0, 3)}
      </div>
      <div className='bg-red-600 font-castelar text-4xl text-white'>
        {date.date()}
      </div>
      <div className='bg-neutral-300 uppercase text-black'>
        {date
          .toDate()
          .toLocaleDateString(language, { weekday: 'short' })
          .slice(0, 3)}
      </div>
    </div>
  );
};

export default Datebox;
