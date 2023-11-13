import {
  IconCalendarEvent,
  IconClipboard,
  IconHome,
  IconInfoSquare,
  IconLink,
  IconMicrophone2,
  IconMusic,
  IconPencil,
  IconQuote,
  IconSpeakerphone,
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
    { label: 'Citat', href: '/quotes', icon: <IconQuote /> },
    { label: 'Länkar', href: '/links', icon: <IconLink /> },
    {
      label: 'Tarmenbokningar',
      href: '/bookings',
      icon: <IconCalendarEvent />,
    },
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
  ],
};

const toElement = (link: NavbarLink) => (
  <Link href={link.href} key={link.label}>
    <Button
      color='navbutton'
      className='flex w-full justify-start hover:bg-red-600'
    >
      {link.icon}
      {link.label}
    </Button>
  </Link>
);

const userTabElement = (
  <div className='flex grow flex-col gap-1'>{userTab.links.map(toElement)}</div>
);

const NavbarContent = ({ isAdmin }: { isAdmin: boolean }) => {
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
          href='/about'
          color='navbutton'
          className='flex w-full justify-start hover:bg-red-600'
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
