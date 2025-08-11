'use client';

import React, { Fragment, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SongListEntry from './entry';
import { api } from 'trpc/react';
import { IconPin } from '@tabler/icons-react';

export interface Song {
  id: string;
  title: string;
  author: string;
  melody: string;
  views: number;
}

interface SongListProps {
  songs: Song[];
  pinnedSongs: Song[];
}

export type MatchFlag = 'title' | 'author' | 'melody' | 'views';

const filterSongs = (songs: Song[], search: string) => {
  if (search === '')
    return songs.map((song) => ({ ...song, matches: ['title' as MatchFlag] }));
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
  return songs.map(({ matches, ...song }) => {
    const titleLetter = song.title[0]?.toUpperCase() ?? '';
    let shouldAddLetter = false;
    if (titleLetter !== prevTitleLetter) {
      prevTitleLetter = titleLetter;
      shouldAddLetter = true;
    }
    return (
      <Fragment key={song.id}>
        {shouldAddLetter && <h5 className='py-2 pl-3'>{titleLetter}</h5>}
        <SongListEntry song={song} matches={matches} />
      </Fragment>
    );
  });
};

const SongList = ({ songs, pinnedSongs: pinnedSongsProp }: SongListProps) => {
  const router = useRouter();

  const { data: pinnedSongs, refetch: refetchPinnedSongs } =
    api.song.getPinned.useQuery(undefined, { initialData: pinnedSongsProp });

  useEffect(() => {
    for (const song of pinnedSongs) {
      router.prefetch(`/songs/${song.id}`);
    }
  }, [pinnedSongs]);

  useEffect(() => {
    const interval = setInterval(() => {
      void refetchPinnedSongs();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const searchParams = useSearchParams();
  const search = searchParams?.get('search') ?? '';
  const songList = useMemo(
    () => genSongList(filterSongs(songs, search)),
    [songs, search],
  );
  return (
    <div className='flex flex-col divide-y divide-solid text-base dark:divide-neutral-700'>
      {pinnedSongs.length > 0 && (
        <>
          <div className='py-2 pl-3'>
            <IconPin />
          </div>
          {pinnedSongs.map((song) => (
            <SongListEntry key={song.id} song={song} />
          ))}
        </>
      )}
      {songList}
    </div>
  );
};

export default SongList;
