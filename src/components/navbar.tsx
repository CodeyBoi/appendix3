import {
  Box,
  Button,
  Divider,
  Navbar,
  SegmentedControl,
  Space,
  createStyles,
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
  IconQuote,
  IconSpeakerphone,
  IconUser,
} from '@tabler/icons';
import cuid from 'cuid';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getOperatingYear } from '../pages/stats/[paramYear]';
import { trpc } from '../utils/trpc';

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
    backgroundColor: theme?.colors?.blue?.[8],
    border: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    ...theme.fn.focusStyles(),
    backgroundColor: theme?.colors?.blue?.[8],

    '&:hover': {
      backgroundColor: theme?.colors?.blue?.[7],
    },
  },
  activeLink: {
    backgroundColor: theme?.colors?.blue?.[7],
  },
  control: {
    backgroundColor: theme?.colors?.blue?.[7],
  },
}));

const tabs: { [key in TabLabel]: LinkGroup[] } = {
  user: [
    {
      links: [
        { label: 'Pääsivu', href: '/', icon: <IconHome /> },
        { label: 'Minun sivujani', href: '/account', icon: <IconUser /> },
        {
          label: 'Tilastot',
          href: `/stats/${getOperatingYear()}`,
          icon: <IconClipboard />,
        },
        { label: 'Keikat', href: '/gigs', icon: <IconSpeakerphone /> },
        { label: 'Laulut', href: '/songs', icon: <IconPencil /> },
        { label: 'Sitaatit', href: '/quotes', icon: <IconQuote /> },
        { label: 'Linkit', href: '/links', icon: <IconLink /> },
      ],
    },
  ],
  admin: [
    {
      links: [
        {
          label: 'Corps',
          href: '/admin/corps',
          icon: <IconUser />,
        },
        {
          label: 'Spelningar',
          href: '/admin/gigs',
          icon: <IconMusic />,
        },
        {
          label: 'Repor',
          href: '/admin/rehearsal',
          icon: <IconPencil />,
        },
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
    <div className='flex flex-col gap-2' key={tab.title || cuid()}>
      {tab.title && <Divider label={tab.title} color='white' />}
      {tab.links.map((link) => (
        <Button
          key={link.label}
          className={cx(classes.link, {
            [classes.activeLink]: active === link.href,
          })}
          component={Link}
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
    </div>
  ));

  return (
    <Box
      style={{ height: 'calc(100vh - 56px)' }}
      pb='md'
      className={classes.navbar}
    >
      {isAdmin && (
        <Navbar.Section pt='sm' mx='sm'>
          <SegmentedControl
            className={classes.control}
            color={theme?.colors?.blue?.[8]}
            fullWidth
            value={activeTab}
            onChange={(value: TabLabel) => setActiveTab(value)}
            transitionTimingFunction='ease'
            styles={{
              active: { backgroundColor: theme?.colors?.blue?.[8] },
              label: {
                color: theme?.colors?.gray?.[4],
                ':hover': { color: theme.white },
              },
            }}
            data={[
              { label: 'Käyttäjä', value: 'user' },
              { label: 'Admin', value: 'admin' },
            ]}
          />
        </Navbar.Section>
      )}
      <Navbar.Section sx={{ overflowY: 'auto' }} grow pt='sm' mx='sm'>
        {links}
      </Navbar.Section>
      <Space p={6} />
      <Navbar.Section pb='sm' mx='sm'>
        <Button
          px={6}
          leftIcon={<IconInfoSquare />}
          component={Link}
          href='/about'
          className={classes.link}
          styles={{ inner: { justifyContent: 'flex-start' } }}
          style={{ width: '100%' }}
          onClick={() => {
            onLinkClicked?.('/about');
            setActive('/about');
          }}
        >
          Tietoja sivusta
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
          Kirjautua ulos
        </Button>
      </Navbar.Section>
    </Box>
  );
};

export default NavbarContent;
