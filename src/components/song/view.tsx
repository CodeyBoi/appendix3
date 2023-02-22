import { Stack, Title, Text, Button, Group } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { Song } from '@prisma/client';
import React from 'react';
// import { trpc } from '../../utils/trpc';

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
        <Title order={4}>{song.title}</Title>
        {isAdmin && (
          <Button
            sx={{ width: 'min-content' }}
            component={NextLink}
            href={`/admin/songs/${song.id}`}
          >
            Redigera
          </Button>
        )}
      </Group>
      {song.author && (
        <Text>
          <i>{`Skriven av: ${song.author}`}</i>
        </Text>
      )}
      {song.melody && (
        <Text>
          <i>{`Melodi: ${song.melody}`}</i>
        </Text>
      )}
      <Text mt={12} sx={{ whiteSpace: 'pre-wrap' }}>{`${song.lyrics}`}</Text>
    </Stack>
  );
};

export default SongView;
