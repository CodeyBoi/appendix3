'use client';

import { IconEdit, IconPin, IconPinned, IconShare } from '@tabler/icons-react';
import Button from 'components/input/button';
import CopyToClipboard from 'components/input/copy-to-clipboard';
import React, { useState } from 'react';
import { api } from 'trpc/react';
import { lang } from 'utils/language';

interface SongMenuContentProps {
  link: string;
  id: string;
}

const SongMenuContent = ({ id, link }: SongMenuContentProps) => {
  const [isPinned, setIsPinned] = useState(false);

  const pinSong = api.song.pin.useMutation({
    onSuccess: () => {
      setIsPinned(true);
    },
  });

  return (
    <div className='flex flex-col'>
      <CopyToClipboard
        fullWidth
        className='flex justify-start hover:bg-red-600/10'
        color='transparent'
        text={link}
      >
        <IconShare />
        {lang('Kopiera länk', 'Copy link')}
      </CopyToClipboard>
      <Button
        fullWidth
        href={`/admin/songs/${id}`}
        className='flex justify-start hover:bg-red-600/10'
        color='transparent'
      >
        <IconEdit />
        {lang('Redigera', 'Edit')}
      </Button>
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
    </div>
  );
};

export default SongMenuContent;
