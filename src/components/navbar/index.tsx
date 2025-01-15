import {
  IconClipboard,
  IconClipboardList,
  IconHome,
  IconInfoSquare,
  IconKey,
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
import { Permission } from 'utils/permission';

interface NavbarLink {
  label: React.ReactNode;
  href: string;
  icon: React.ReactNode;
  permission?: Permission;
}

interface NavbarLinkGroup {
  title: React.ReactNode;
  value: TabValue;
  links: NavbarLink[];
}

interface NavbarContentProps {
  currentDate?: Date;
}

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
      permission: 'manageCorps',
    },
    {
      label: lang('Spelningar', 'Gigs'),
      href: '/admin/gigs',
      icon: <IconSpeakerphone />,
      permission: 'manageGigs',
    },
    {
      label: lang('Repor', 'Rehearsals'),
      href: '/admin/rehearsal',
      icon: <IconPencil />,
      permission: 'manageRehearsals',
    },
    {
      label: lang('Behörigheter', 'Permissions'),
      href: '/admin/permissions',
      icon: <IconKey />,
      permission: 'managePermissions',
    },
    {
      label: lang('Sektioner', 'Sections'),
      href: '/admin/section',
      icon: <IconMicrophone2 />,
      permission: 'manageSections',
    },
    {
      label: lang('Strecklistor', 'Streck Lists'),
      href: '/admin/streck',
      icon: <IconClipboardList />,
      permission: 'manageStreck',
    },
    {
      label: 'Killer',
      href: '/admin/killer',
      icon: <IconSwords />,
      permission: 'manageKiller',
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

const NavbarContent = async ({
  currentDate = new Date(),
}: NavbarContentProps) => {
  const permissions = await api.permission.getOwnPermissions.query();

  const adminTabLinks = adminTab.links.filter((link) =>
    link.permission ? permissions.has(link.permission) : true,
  );
  const adminTabElement =
    adminTabLinks.length > 0 ? (
      <div className='flex grow flex-col gap-1'>
        {adminTabLinks.map(toElement)}
      </div>
    ) : undefined;

  const [killerGame, killerPlayer] = await Promise.all([
    api.killer.gameExists.query(),
    api.killer.getOwnPlayerInfo.query(),
  ]);

  const hasntSignedUpForExistingKillerGame =
    killerGame.exists &&
    killerGame.start &&
    killerGame.start > currentDate &&
    !killerPlayer;

  const userTabElement = (
    <div className='flex grow flex-col gap-1'>
      {userTab.links.map(toElement)}
      {killerGame.exists && toElement(killerLabel)}
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
      <div className='overflow-y-auto'>
        <NavbarControl userTab={userTabElement} adminTab={adminTabElement} />
      </div>
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
