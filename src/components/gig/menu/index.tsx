'use client';

import { Menu } from '@mantine/core';

type GigMenuProps = {
  target: React.ReactNode;
  dropdown: React.ReactNode;
};

const GigMenu = ({ target, dropdown }: GigMenuProps) => {
  return (
    <Menu shadow='md' width={200} position='left-start' withArrow>
      <Menu.Target>{target}</Menu.Target>
      <Menu.Dropdown>{dropdown}</Menu.Dropdown>
    </Menu>
  );
};

export default GigMenu;
