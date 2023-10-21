'use client';

import { trpc } from 'utils/trpc';
import NavbarContent from './content';

const NavbarBody = () => {
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const isAdmin = corps?.role?.name === 'admin';
  return <NavbarContent isAdmin={isAdmin} />;
};

export default NavbarBody;
