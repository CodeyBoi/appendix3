import React, { useMemo } from 'react';
import {
  Table,
  Title,
  Stack,
  Group,
  Text,
  ActionIcon,
  TextInput,
} from '@mantine/core';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import Loading from '../../components/loading';
import { NextLink } from '@mantine/next';
import { IconPlus, IconSearch } from '@tabler/icons';

const Songs = () => {
  // const { data: corps } = trpc.corps.getSelf.useQuery();
  // const isAdmin = corps?.role?.name === 'admin';
  const isAdmin = true; // Remove this when we move songs to admin

  const [search, setSearch] = React.useState<string>('');

  const { data: songs, isLoading: songsLoading } = trpc.song.getAll.useQuery();

  const loading = songsLoading || !songs;

  const songList = useMemo(() => {
    let prevTitleLetter: string | undefined;
    return loading ? (
      <Loading msg='Laddar sånger...' />
    ) : songs && songs.length > 0 ? (
      <Table fontSize={16} highlightOnHover>
        <tbody>
          {songs.map((song) => {
            // Filter out songs that don't match the search
            if (
              search &&
              !song.title.toLowerCase().includes(search.toLowerCase())
            ) {
              return null;
            }
            const titleLetter = song.title[0]?.toUpperCase() ?? '';
            let shouldAddLetter = false;
            if (titleLetter !== prevTitleLetter) {
              prevTitleLetter = titleLetter;
              shouldAddLetter = true;
            }
            return (
              <React.Fragment key={song.id}>
                {shouldAddLetter && (
                  // We set color to unset to get rid of the highlightOnHover
                  <tr style={{ backgroundColor: 'unset' }}>
                    <td colSpan={12}>
                      <Title order={5}>{titleLetter}</Title>
                    </td>
                  </tr>
                )}
                <Link href={`/songs/${song.id}`} key={song.id}>
                  <tr style={{ cursor: 'pointer' }}>
                    <td>
                      <Text pl={12}>{song.title}</Text>
                    </td>
                  </tr>
                </Link>
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>
    ) : (
      <Title sx={{ whiteSpace: 'nowrap' }} order={4}>
        Här fanns inget att se :/
      </Title>
    );
  }, [loading, songs, search]);

  return (
    <Stack sx={{ maxWidth: '500px' }}>
      <Group position='apart'>
        <TextInput
          placeholder='Sök...'
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          icon={<IconSearch />}
          sx={{ flex: '1' }}
        />
        {isAdmin && (
          <ActionIcon component={NextLink} href='/admin/songs/new'>
            <IconPlus />
          </ActionIcon>
        )}
      </Group>
      {songList}
    </Stack>
  );
};

export default Songs;
