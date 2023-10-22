'use client';

import React, { useState } from 'react';
import SegmentedControl from 'components/input/segmented-control';
import { TabValue } from './content';

interface NavbarContentProps {
  userTab: React.ReactNode;
  adminTab?: React.ReactNode;
}

const NavbarControl = ({ userTab, adminTab }: NavbarContentProps) => {
  const [tab, setTab] = useState<TabValue>('user');
  const isAdmin = adminTab !== undefined;
  return (
    <>
      {isAdmin && (
        <SegmentedControl
          color='red'
          defaultValue='user'
          onChange={(value) => setTab(value as TabValue)}
          options={[
            { label: 'Användare', value: 'user' },
            { label: 'Admin', value: 'admin' },
          ]}
        />
      )}
      {tab === 'user' && userTab}
      {tab === 'admin' && adminTab}
    </>
  );
};

export default NavbarControl;
