'use client';

import React, { useState } from 'react';
import SegmentedControl from 'components/segmented-control';
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
          className='bg-red-700'
          color={'rgb(180 7 0 / var(--tw-bg-opacity))'}
          fullWidth
          value={tab}
          onChange={(value: TabValue) => setTab(value)}
          transitionTimingFunction='ease'
          styles={{
            active: { backgroundColor: 'rgb(129 3 0 / var(--tw-bg-opacity))' },
            label: {
              color: '#cccccc',
              ':hover': { color: 'white' },
            },
          }}
          data={[
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
