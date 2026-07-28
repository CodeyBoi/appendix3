import React from 'react';
import { MatchFlag, Song } from './list';
import Link from 'next/link';
import { lang } from 'utils/language';

interface SongListEntryProps {
  song: Song;
  matches?: MatchFlag[];
}

const SongListEntry = ({
  song: { title, author, melody, views },
  matches = ['title'],
}: SongListEntryProps) => {
  return (
    <Link href={`/songs/${encodeURIComponent(title.replaceAll(' ', '_'))}`}>
      <div className='flex cursor-pointer items-center gap-2 py-2 pl-6 hover:bg-red-300/10'>
        <div className='grow'>{title}</div>
        <div
          className={
            'text-xs text-neutral-500' +
            (author && matches.includes('author') ? '' : ' hidden')
          }
        >
          {lang('Skriven av: ', 'Written by: ')}
          {author}
        </div>
        <div
          className={
            'text-xs text-neutral-500' +
            (melody && matches.includes('melody') ? '' : ' hidden')
          }
        >
          {lang('Melodi: ', 'Melody: ')}
          {melody}
        </div>
        <div
          className={
            'text-xs text-neutral-500' +
            (matches.includes('views') ? '' : ' hidden')
          }
        >
          {lang('Visningar: ', 'Views: ')}
          {views.toString()}
        </div>
      </div>
    </Link>
  );
};

export default SongListEntry;
