'use client';

import React, { useState } from 'react';
import SegmentedControl from 'components/input/segmented-control';
import { TabValue } from './content';
import { usePathname } from 'next/navigation';

interface NavbarContentProps {
  userTab: React.ReactNode;
  adminTab?: React.ReactNode;
}

const NavbarControl = ({ userTab, adminTab }: NavbarContentProps) => {
  const pathname = usePathname();
  const initialTab = pathname?.startsWith('/admin') ? 'admin' : 'user';
  const [tab, setTab] = useState<TabValue>(initialTab);
  const isAdmin = adminTab !== undefined;
  return (
    <>
      {isAdmin && (
        <SegmentedControl
          color='red'
          defaultValue={initialTab}
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
