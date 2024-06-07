'use client';

import React, { Fragment, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { lang } from 'utils/language';

type Song = {
  id: string;
  title: string;
  author: string;
  melody: string;
  views: number;
};

type MatchFlag = 'title' | 'author' | 'melody' | 'views';

const filterSongs = (songs: Song[], search: string) => {
  if (search === '')
    return songs.map((song) => ({ ...song, matches: ['title'] }));
  const searchLower = search.toLowerCase();
  return songs.flatMap((song) => {
    const matches: MatchFlag[] = [];
    const title = song.title.toLowerCase();
    if (title.includes(searchLower)) matches.push('title');

    // Only search for author and melody if the search string is longer than 2 characters
    if (search.length > 2) {
      const author = song.author.toLowerCase();
      if (author.includes(searchLower)) matches.push('author');
      const melody = song.melody.toLowerCase();
      if (melody.includes(searchLower)) matches.push('melody');
      if (searchLower === 'views') matches.push('views');
    }

    if (matches.length === 0) {
      return [];
    }

    return [
      {
        ...song,
        matches,
      },
    ];
  });
};

const genSongList = (songs: ReturnType<typeof filterSongs>) => {
  let prevTitleLetter: string | undefined;
  return (
    <div className='flex flex-col divide-y divide-solid text-base dark:divide-neutral-700'>
      {songs.map(({ id, title, author, melody, matches, views }) => {
        const titleLetter = title[0]?.toUpperCase() ?? '';
        let shouldAddLetter = false;
        if (titleLetter !== prevTitleLetter) {
          prevTitleLetter = titleLetter;
          shouldAddLetter = true;
        }
        return (
          <Fragment key={id}>
            {shouldAddLetter && <h5 className='py-2 pl-3'>{titleLetter}</h5>}
            <Link href={`/songs/${id}`}>
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
          </Fragment>
        );
      })}
    </div>
  );
};

const SongList = ({ songs }: { songs: Song[] }) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get('search') ?? '';
  const songList = useMemo(
    () => genSongList(filterSongs(songs, search)),
    [songs, search],
  );
  return songList;
};

export default SongList;
