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

type NavbarLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};
type NavbarLinkGroup = {
  title: string;
  value: TabValue;
  links: NavbarLink[];
};

export type TabValue = 'user' | 'admin';

const userTab: NavbarLinkGroup = {
  title: 'Användare',
  value: 'user',
  links: [
    { label: 'Huvudsida', href: '/', icon: <IconHome /> },
    { label: 'Mina sidor', href: '/account', icon: <IconUser /> },
    {
      label: 'Statistik',
      href: `/stats`,
      icon: <IconClipboard />,
    },
    { label: 'Spelningar', href: '/gigs', icon: <IconSpeakerphone /> },
    { label: 'Sånger', href: '/songs', icon: <IconMusic /> },
    { label: 'Länkar', href: '/links', icon: <IconLink /> },
    { label: 'Killer', href: '/killer', icon: <IconSwords /> },
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
      label: 'Spelningar',
      href: '/admin/gigs',
      icon: <IconSpeakerphone />,
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
    {
      label: 'Killer',
      href: '/admin/killer',
      icon: <IconSwords />,
    },
  ],
};

const toElement = (link: NavbarLink) => (
  <Link href={link.href} key={link.label}>
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

const userTabElement = (
  <div className='flex grow flex-col gap-1'>{userTab.links.map(toElement)}</div>
);

const NavbarContent = async ({ isAdmin }: { isAdmin: boolean }) => {
  const adminTabElement = isAdmin ? (
    <div className='flex grow flex-col gap-1'>
      {adminTab.links.map(toElement)}
    </div>
  ) : undefined;
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
          Om sidan
        </Button>
        <SignOutButton />
      </div>
    </div>
  );
};

export default NavbarContent;
