import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  createStyles,
  Divider,
  Navbar,
  SegmentedControl,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import {
  IconClipboard,
  IconHome,
  IconInfoSquare,
  IconLink,
  IconLogout,
  IconMicrophone2,
  IconMusic,
  IconPencil,
  IconPencilPlus,
  IconQuote,
  IconSpeakerphone,
  IconUser,
  IconUserPlus,
} from '@tabler/icons';
import { getOperatingYear } from '../pages/stats/[paramYear]';
import { NextLink } from '@mantine/next';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import cuid from 'cuid';
import IconMusicPlus from './icons/music-plus';

interface LinkItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface LinkGroup {
  title?: string;
  links: LinkItem[];
}

type TabLabel = 'user' | 'admin';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme?.colors?.red?.[6],
    border: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    ...theme.fn.focusStyles(),
    backgroundColor: theme?.colors?.red?.[6],

    '&:hover': {
      backgroundColor: theme?.colors?.red?.[7],
    },
  },
  activeLink: {
    backgroundColor: theme?.colors?.red?.[7],
  },
  control: {
    backgroundColor: theme?.colors?.red?.[6],
  },
}));

const tabs: { [key in TabLabel]: LinkGroup[] } = {
  user: [
    {
      links: [
        { label: 'Huvudsida', href: '/', icon: <IconHome /> },
        { label: 'Mina sidor', href: '/account', icon: <IconUser /> },
        {
          label: 'Statistik',
          href: `/stats/${getOperatingYear()}`,
          icon: <IconClipboard />,
        },
        { label: 'Spelningar', href: '/gigs', icon: <IconSpeakerphone /> },
        { label: 'Sånger', href: '/songs', icon: <IconPencil /> },
        { label: 'Citat', href: '/quotes', icon: <IconQuote /> },
        { label: 'Länkar', href: '/links', icon: <IconLink /> },
      ],
    },
  ],
  admin: [
    {
      title: 'Corps',
      links: [
        {
          label: 'Skapa corps',
          href: '/admin/corps/new',
          icon: <IconUserPlus />,
        },
        {
          label: 'Visa och uppdatera corps',
          href: '/admin/corps',
          icon: <IconUser />,
        },
      ],
    },
    {
      title: 'Spelningar',
      links: [
        {
          label: 'Skapa spelning',
          href: '/admin/gig/new',
          icon: <IconMusicPlus />,
        },
        {
          label: 'Visa alla spelningar',
          href: '/admin/gigs',
          icon: <IconMusic />,
        },
      ],
    },
    {
      title: 'Repor',
      links: [
        {
          label: 'Skapa rep',
          href: '/admin/rehearsal/new',
          icon: <IconPencilPlus />,
        },
        {
          label: 'Visa alla rep',
          href: '/admin/rehearsal',
          icon: <IconPencil />,
        },
      ],
    },
    {
      title: 'Övrigt',
      links: [
        {
          label: 'Sektioner',
          href: '/admin/section',
          icon: <IconMicrophone2 />,
        },
      ],
    },
  ],
};

interface NavbarContentProps {
  // Used to close the navbar on mobile when a link is clicked
  onLinkClicked?: (value?: string) => void;
}

const NavbarContent = ({ onLinkClicked }: NavbarContentProps) => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('');
  const [activeTab, setActiveTab] = useState<TabLabel>('user');

  const { data: corps } = trpc.corps.getSelf.useQuery();
  const isAdmin = corps?.role?.name === 'admin';

  const theme = useMantineTheme();
  const router = useRouter();

  useEffect(() => {
    setActive(router.asPath);
  }, [router.asPath]);

  const links = tabs[activeTab].map((tab) => (
    <Stack key={tab.title || cuid()} spacing='xs'>
      {tab.title && <Divider label={tab.title} color='white' />}
      {tab.links.map((link) => (
        <Button
          key={link.label}
          className={cx(classes.link, {
            [classes.activeLink]: active === link.href,
          })}
          component={NextLink}
          href={link.href}
          onClick={() => {
            setActive(link.href);
            onLinkClicked?.(link.href);
          }}
          leftIcon={link.icon}
          styles={{ inner: { justifyContent: 'flex-start' } }}
        >
          {link.label}
        </Button>
      ))}
    </Stack>
  ));

  return (
    <Box
      style={{ height: 'calc(100vh - 60px)' }}
      pb='md'
      className={classes.navbar}
    >
      {isAdmin && (
        <Navbar.Section pt='sm' mx='sm'>
          <SegmentedControl
            className={classes.control}
            color={theme?.colors?.red?.[6]}
            fullWidth
            value={activeTab}
            onChange={(value: TabLabel) => setActiveTab(value)}
            transitionTimingFunction='ease'
            styles={{
              active: { backgroundColor: theme?.colors?.red?.[7] },
              label: {
                color: theme?.colors?.gray?.[4],
                ':hover': { color: theme.white },
              },
            }}
            data={[
              { label: 'Användare', value: 'user' },
              { label: 'Admin', value: 'admin' },
            ]}
          />
        </Navbar.Section>
      )}
      <Navbar.Section grow pt='sm' mx='sm'>
        <Stack>{links}</Stack>
      </Navbar.Section>
      <Navbar.Section pb='sm' mx='sm'>
        <Button
          px={6}
          leftIcon={<IconInfoSquare />}
          component={NextLink}
          href='/about'
          className={classes.link}
          styles={{ inner: { justifyContent: 'flex-start' } }}
          style={{ width: '100%' }}
          onClick={() => {
            onLinkClicked?.('/about');
            setActive('/about');
          }}
        >
          Om sidan
        </Button>
        <Button
          px={6}
          leftIcon={<IconLogout />}
          onClick={() => {
            signOut();
            router.push('/');
          }}
          className={classes.link}
          styles={{ inner: { justifyContent: 'flex-start' } }}
          style={{ width: '100%' }}
        >
          Logga ut
        </Button>
      </Navbar.Section>
    </Box>
  );
};

export default NavbarContent;
