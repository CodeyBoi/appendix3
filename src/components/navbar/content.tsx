import {
  IconClipboard,
  IconHome,
  IconInfoSquare,
  IconLink,
  IconMicrophone2,
  IconMusic,
  IconPencil,
  IconSpeakerphone,
  IconSwords,
  IconUser,
} from '@tabler/icons-react';
import Button from 'components/input/button';
import SignOutButton from 'components/sign-out-button';
import Link from 'next/link';
import NavbarControl from './control';
import { api } from 'trpc/server';
import { lang } from 'utils/language';

type NavbarLink = {
  label: React.ReactNode;
  href: string;
  icon: React.ReactNode;
};
type NavbarLinkGroup = {
  title: React.ReactNode;
  value: TabValue;
  links: NavbarLink[];
};

export type TabValue = 'user' | 'admin';

const userTab: NavbarLinkGroup = {
  title: lang('Användare', 'User'),
  value: 'user',
  links: [
    { label: lang('Huvudsida', 'Homepage'), href: '/', icon: <IconHome /> },
    {
      label: lang('Mina sidor', 'My pages'),
      href: '/account',
      icon: <IconUser />,
    },
    {
      label: lang('Statistik', 'Statistics'),
      href: `/stats`,
      icon: <IconClipboard />,
    },
    {
      label: lang('Spelningar', 'Gigs'),
      href: '/gigs',
      icon: <IconSpeakerphone />,
    },
    { label: lang('Sånger', 'Songs'), href: '/songs', icon: <IconMusic /> },
    { label: lang('Länkar', 'Links'), href: '/links', icon: <IconLink /> },
  ],
};
const adminTab: NavbarLinkGroup = {
  title: 'Admin',
  value: 'admin',
  links: [
    {
      label: 'Corps',
      href: '/admin/corps',
      icon: <IconUser />,
    },
    {
      label: lang('Spelningar', 'Gigs'),
      href: '/admin/gigs',
      icon: <IconSpeakerphone />,
    },
    {
      label: lang('Repor', 'Rehearsals'),
      href: '/admin/rehearsal',
      icon: <IconPencil />,
    },
    {
      label: lang('Sektioner', 'Sections'),
      href: '/admin/section',
      icon: <IconMicrophone2 />,
    },
    {
      label: 'Killer',
      href: '/admin/killer',
      icon: <IconSwords />,
    },
  ],
};

const toElement = (link: NavbarLink) => (
  <Link href={link.href} key={link.href}>
    <Button
      color='navbutton'
      className='flex justify-start hover:bg-red-600'
      fullWidth
    >
      {link.icon}
      {link.label}
    </Button>
  </Link>
);

const killerLabel = { label: 'Killer', href: '/killer', icon: <IconSwords /> };

const NavbarContent = async ({ isAdmin }: { isAdmin: boolean }) => {
  const adminTabElement = isAdmin ? (
    <div className='flex grow flex-col gap-1'>
      {adminTab.links.map(toElement)}
    </div>
  ) : undefined;

  const [killerGameExists, killerPlayer] = await Promise.all([
    api.killer.gameExists.query(),
    api.killer.getOwnPlayerInfo.query(),
  ]);

  const hasntSignedUpForExistingKillerGame = killerGameExists && !killerPlayer;

  const userTabElement = (
    <div className='flex grow flex-col gap-1'>
      {userTab.links.map(toElement)}
      {killerGameExists && toElement(killerLabel)}
      {hasntSignedUpForExistingKillerGame && (
        <div className='flex justify-center p-2 text-white motion-safe:animate-bounce lg:hidden'>
          {lang('⬆️ Följ pilarna! ⬆️', '⬆️ Follow the arrows! ⬆️')}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{ height: 'calc(100vh - 56px)' }}
      className='flex w-72 flex-col justify-between gap-2 border-0 bg-red-700 px-3 pb-16 pt-3 lg:pb-4'
    >
      <NavbarControl userTab={userTabElement} adminTab={adminTabElement} />
      <div className='flex flex-col'>
        <Button
          className='flex justify-start hover:bg-red-600'
          href='/about'
          color='navbutton'
          fullWidth
        >
          <IconInfoSquare />
          {lang('Om sidan', 'About')}
        </Button>
        <SignOutButton />
      </div>
    </div>
  );
};

export default NavbarContent;
