import { Dayjs } from 'dayjs';
import React from 'react';

interface DateboxProps {
  date: Dayjs;
}

const Datebox = ({ date }: DateboxProps) => (
  <div
    className='flex h-min w-16 flex-col rounded border border-black text-center'
    style={{ boxShadow: '2px 3px #888888' }}
  >
    <div className='bg-red-600 pt-0.5 text-xs font-light uppercase text-white'>
      {date
        .toDate()
        .toLocaleDateString('sv-SE', { month: 'short' })
        .slice(0, 3)}
    </div>
    <div className='bg-red-600 font-castelar text-4xl text-white'>
      {date.date()}
    </div>
    <div className='bg-neutral-300 uppercase text-black'>
      {date
        .toDate()
        .toLocaleDateString('sv-SE', { weekday: 'short' })
        .slice(0, 3)}
    </div>
  </div>
);

export default Datebox;
