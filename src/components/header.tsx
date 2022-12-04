import React from 'react';
import { Header, Group, Button } from '@mantine/core';
import Logo from './logo';
import AdminMenu from './admin-menu';
import { IconClipboard, IconLogout, IconUser, IconSpeakerphone } from '@tabler/icons';
import { signOut, useSession } from 'next-auth/react';
import { NextLink } from '@mantine/next';

const getOperatingYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  // If month is September or later, return current year, else return previous year
  return date.getMonth() >= 8 ? year : year - 1;
}

const AppendixHeader = () => {

  const { data: session } = useSession();
  const isAdmin = session?.user?.corps?.role?.name === 'admin';

  return (
    <Header height={60} p="sm" sx={(theme) => ({
      backgroundColor: theme?.colors?.red?.[5],
      color: theme.white,
      zIndex: 516,
    })}>
      <Group position="apart">
        <Logo />
        <Group spacing={0}>
          {isAdmin && <AdminMenu />}
          <Button px={6} leftIcon={<IconSpeakerphone />} component={NextLink} href='/gig'>Spelningar</Button>
          <Button px={6} leftIcon={<IconClipboard />} size="sm" component={NextLink} href={`/stats/${getOperatingYear()}`}>Statistik</Button>
          <Button px={6} leftIcon={<IconUser />} size='sm' component={NextLink} href="/account">Mina sidor</Button>
          <Button px={6} leftIcon={<IconLogout />} size='sm' onClick={() => signOut()}>Logga ut</Button>
        </Group>
      </Group>
    </Header>
  );
}

export default AppendixHeader;
