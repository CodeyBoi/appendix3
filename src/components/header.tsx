import React from 'react';
import { Header, Group, Button } from '@mantine/core';
import Logo from './logo';
import AdminMenu from './admin-menu';
import { IconClipboard, IconLogout, IconUser, IconSpeakerphone } from '@tabler/icons';
import { signOut } from 'next-auth/react';
import { NextLink } from '@mantine/next';

const getOperatingYear = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  // If month is September or later, return current year, else return previous year
  return month >= 8 ? year : year - 1;
}

const AppendixHeader = () => {

  // const { data: permissions, status: permissionsStatus } = useQuery<Set<string>>(['permissions'], fetchPermissions, {
  //   enabled: !!token,
  //   staleTime: 1000 * 60 * 60,
  // });

  // if (permissionsStatus === 'loading') {
  //   return null;
  // }

  // else if (permissionsStatus === 'error') {
  //   return <AlertError msg='Något gick horribelt fel' />;
  // }

  return (
    <Header height={60} p="sm" sx={(theme) => ({
      backgroundColor: theme.colors.red[5],
      color: theme.white,
      zIndex: 516,
    })}>
      <Group position="apart">
        <Logo />
        <Group spacing={0}>
          {/* {permissions && permissions.size > 0 && <AdminMenu permissions={permissions} />} */}
          <Button compact leftIcon={<IconSpeakerphone size={20} />} component={NextLink} href='/gig'>Spelningar</Button>
          <Button compact leftIcon={<IconClipboard size={20} />} size="sm" component={NextLink} href={`/stats/${getOperatingYear()}`}>Statistik</Button>
          <Button compact leftIcon={<IconUser size={20} />} size='sm' component={NextLink} href="/me">Mina sidor</Button>
          <Button compact leftIcon={<IconLogout size={20} />} size='sm' onClick={() => signOut()}>Logga ut</Button>
        </Group>
      </Group>
    </Header>
  );
}

export default AppendixHeader;
