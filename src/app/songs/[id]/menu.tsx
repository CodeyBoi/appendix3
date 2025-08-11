'use client';

import { IconEdit, IconPin, IconPinned } from '@tabler/icons-react';
import Button from 'components/input/button';
import React, { useState } from 'react';
import { api } from 'trpc/react';
import { lang } from 'utils/language';

interface SongMenuContentProps {
  id: string;
}

const SongMenuContent = ({ id }: SongMenuContentProps) => {
  const [isPinned, setIsPinned] = useState(false);

  const pinSong = api.song.pin.useMutation({
    onSuccess: () => {
      setIsPinned(true);
    },
  });

  return (
    <div className='flex flex-col'>
      <Button
        fullWidth
        disabled={isPinned}
        className='flex justify-start hover:bg-red-600/10'
        color='transparent'
        onClick={() => {
          pinSong.mutate({ id });
        }}
      >
        {isPinned ? <IconPinned /> : <IconPin />}
        {isPinned
          ? lang('Sång fastnålad i 3 minuter!', 'Song pinned for 3 minutes!')
          : lang('Nåla fast sång', 'Pin song')}
      </Button>

      <Button
        fullWidth
        href={`/admin/songs/${id}`}
        className='flex justify-start hover:bg-red-600/10'
        color='transparent'
      >
        <IconEdit />
        {lang('Redigera', 'Edit')}
      </Button>
    </div>
  );
};

export default SongMenuContent;
