import React from 'react';
import { Header, Group, Button } from '@mantine/core';
import Logo from './logo';
import AdminMenu from './admin-menu';
import { ClipboardIcon, ExitIcon, PersonIcon, PlayIcon } from '@radix-ui/react-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPermissions } from '../src/utils/fetches';
import useToken from '../src/utils/use-token';
import AlertError from './alert-error';
import { getOperatingYear } from '../pages/stats/[paramYear]';
import Link from 'next/link';

const AppendixHeader = () => {
  const queryClient = useQueryClient();

  const { token } = useToken();
  const { data: permissions, status: permissionsStatus } = useQuery<Set<string>>(['permissions'], fetchPermissions, {
    enabled: !!token,
    staleTime: 1000 * 60 * 60,
  });

  if (permissionsStatus === 'loading') {
    return null;
  }

  else if (permissionsStatus === 'error') {
    return <AlertError msg='Något gick horribelt fel' />;
  }

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    queryClient.clear();
    window.location.href = "/login";
  }

  return (
    <Header height={60} p="sm" sx={(theme) => ({
      backgroundColor: theme.colors.red[5],
      color: theme.white,
    })}>
      <Group position="apart">
        <Logo />
        <Group spacing={0}>
          {permissions && permissions.size > 0 && <AdminMenu permissions={permissions} />}
          <Button compact leftIcon={<PlayIcon />} component={Link} href="/gigs"><a>Spelningar</a></Button>
          <Button compact leftIcon={<ClipboardIcon />} size="sm" component={Link} href={`/stats/${getOperatingYear()}`}>Statistik</Button>
          <Button compact leftIcon={<PersonIcon />} size='sm' component={Link} href="/me">Mina sidor</Button>
          <Button compact leftIcon={<ExitIcon />} size='sm' onClick={handleLogout}>Logga ut</Button>
        </Group>
      </Group>
    </Header>
  );
}

export default AppendixHeader;
