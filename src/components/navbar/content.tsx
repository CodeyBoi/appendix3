import {
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
} from '@tabler/icons';
import Button from 'components/button';
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

const getOperatingYear = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  // If month is September or later, return current year, else return previous year
  return month >= 8 ? year : year - 1;
};

const userTab: NavbarLinkGroup = {
  title: 'Användare',
  value: 'user',
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
};

const toElement = (link: NavbarLink) => (
  <Link href={link.href} key={link.label}>
    <Button bg='red-700' className='flex justify-start w-full hover:bg-red-800'>
      {link.icon}
      {link.label}
    </Button>
  </Link>
);

const userTabElement = (
  <div className='flex flex-col flex-grow gap-1'>
    {userTab.links.map(toElement)}
  </div>
);

const NavbarContent = ({ isAdmin }: { isAdmin: boolean }) => {
  const adminTabElement = isAdmin ? (
    <div className='flex flex-col flex-grow gap-1'>
      {adminTab.links.map(toElement)}
    </div>
  ) : undefined;
  return (
    <div
      style={{ height: 'calc(100vh - 56px)' }}
      className='flex flex-col gap-2 px-3 pt-3 pb-4 bg-red-700 border-0 w-72'
    >
      <NavbarControl userTab={userTabElement} adminTab={adminTabElement} />
      <div className='flex flex-col'>
        <Button
          href='/about'
          bg='red-700'
          className='flex justify-start w-full hover:bg-red-800'
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
