import { Stack, Title, Text, Group, ActionIcon } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { Song } from '@prisma/client';
import React from 'react';
// import { trpc } from '../../utils/trpc';
import { IconPencil } from '@tabler/icons';

interface SongProps {
  song: Song;
}

const SongView = ({ song }: SongProps) => {
  // const { data: corps } = trpc.corps.getSelf.useQuery();
  // const isAdmin = corps?.role?.name === 'admin';
  const isAdmin = true; // Remove this when we move songs to admin
  return (
    <Stack spacing={0} sx={{ maxWidth: '800px' }}>
      <Group position='apart'>
        <Title order={3}>{song.title}</Title>
        {isAdmin && (
          <ActionIcon component={NextLink} href={`/admin/songs/${song.id}`}>
            <IconPencil />
          </ActionIcon>
        )}
      </Group>
      {song.melody && (
        <Text px={12} mt={6}>
          <i>{`Melodi: ${song.melody}`}</i>
        </Text>
      )}
      {song.author && (
        <Text px={12}>
          <i>{`Skriven av: ${song.author}`}</i>
        </Text>
      )}
      <Text
        mt={12}
        px={12}
        sx={{ whiteSpace: 'pre-wrap' }}
      >{`${song.lyrics}`}</Text>
    </Stack>
  );
};

export default SongView;
