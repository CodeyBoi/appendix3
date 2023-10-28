import { api } from 'trpc/server';
import NavbarContent from './content';

const NavbarBody = async () => {
  const corps = await api.corps.getSelf.query();
  const isAdmin = corps?.role?.name === 'admin';
  return <NavbarContent isAdmin={isAdmin} />;
};

export default NavbarBody;
