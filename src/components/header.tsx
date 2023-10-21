import { Burger, Drawer, Header } from '@mantine/core';
import { useState } from 'react';
import Logo from './logo';
import NavbarBody from './navbar/react';

const AppendixHeader = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <Header
      height={56}
      sx={(theme) => ({
        backgroundColor: theme?.colors?.red?.[5],
        color: theme.white,
        zIndex: 516,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.3)',
        border: 0,
      })}
    >
      <div className='flex items-center justify-between px-3 h-14'>
        <Logo />
        <Burger
          color='white'
          opened={navbarOpen}
          onClick={() => setNavbarOpen(!navbarOpen)}
          title='Open navigation menu'
          sx={(theme) => ({
            [theme.fn.largerThan('sm')]: {
              display: 'none',
            },
          })}
        />
      </div>
      <Drawer
        withCloseButton={false}
        size={300}
        opened={navbarOpen}
        onClose={() => setNavbarOpen(false)}
        position='right'
        sx={(theme) => ({
          [theme.fn.largerThan('sm')]: {
            display: 'none',
          },
        })}
        styles={{
          drawer: {
            paddingTop: 'var(--mantine-header-height) !important',
          },
        }}
      >
        <NavbarBody />
      </Drawer>
    </Header>
  );
};

export default AppendixHeader;
