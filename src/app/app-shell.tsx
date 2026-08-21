import { ReactNode } from 'react';
import NavbarContent from 'components/navbar';
import Header from './header';

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header navbarContent={<NavbarContent />} />
      <div className='fixed top-14 w-72 flex-none max-lg:hidden'>
        <NavbarContent />
      </div>
      {children}
    </>
  );
};

export default AppShell;
