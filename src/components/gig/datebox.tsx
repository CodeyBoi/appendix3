import { Dayjs } from 'dayjs';
import React from 'react';

interface DateboxProps {
  date: Dayjs;
}

const Datebox = ({ date }: DateboxProps) => (
  <div
    className='flex flex-col w-16 text-center border border-black rounded h-min'
    style={{ boxShadow: '2px 3px #888888' }}
  >
    <div className='pt-0.5 text-xs text-white uppercase font-light bg-red-600'>
      {date
        .toDate()
        .toLocaleDateString('sv-SE', { month: 'short' })
        .slice(0, 3)}
    </div>
    <div className='text-4xl text-white bg-red-600 font-castelar'>
      {date.date()}
    </div>
    <div className='text-black uppercase bg-neutral-300'>
      {date
        .toDate()
        .toLocaleDateString('sv-SE', { weekday: 'short' })
        .slice(0, 3)}
    </div>
  </div>
);

export default Datebox;
