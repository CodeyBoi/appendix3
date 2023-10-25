'use client';

import React, { Fragment, useMemo } from 'react';
import SongListElement, { SongListElementProps } from './list-element';
import { useSearchParams } from 'next/navigation';

const filterSongs = (songs: SongListElementProps[], search: string) => {
  if (search === '') return songs;
  const searchLower = search.toLowerCase();
  return songs.filter((song) => song.title.toLowerCase().includes(searchLower));
};

const genSongList = (songs: SongListElementProps[]) => {
  let prevTitleLetter: string | undefined;
  return (
    <div className='flex flex-col text-base divide-y divide-solid'>
      {songs.map((song) => {
        const titleLetter = song.title[0]?.toUpperCase() ?? '';
        let shouldAddLetter = false;
        if (titleLetter !== prevTitleLetter) {
          prevTitleLetter = titleLetter;
          shouldAddLetter = true;
        }
        return (
          <Fragment key={song.id}>
            {shouldAddLetter && <h5 className='py-2 pl-3'>{titleLetter}</h5>}
            <SongListElement title={song.title} id={song.id} />
          </Fragment>
        );
      })}
    </div>
  );
};

const SongList = ({ songs }: { songs: SongListElementProps[] }) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get('search') ?? '';
  const filteredSongs = useMemo(
    () => filterSongs(songs, search),
    [songs, search],
  );
  const songList = useMemo(() => genSongList(filteredSongs), [filteredSongs]);
  return songList;
};

export default SongList;
