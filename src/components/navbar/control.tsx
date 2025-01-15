'use client';

import React, { ReactNode, useState } from 'react';
import SegmentedControl from 'components/input/segmented-control';
import { TabValue } from '.';
import { usePathname } from 'next/navigation';

interface NavbarContentProps {
  userTab: ReactNode;
  adminTab?: ReactNode;
}

const NavbarControl = ({ userTab, adminTab }: NavbarContentProps) => {
  const pathname = usePathname();
  const initialTab = pathname?.startsWith('/admin') ? 'admin' : 'user';
  const [tab, setTab] = useState<TabValue>(initialTab);
  return (
    <div className='flex flex-col gap-2'>
      {adminTab !== undefined && (
        <SegmentedControl
          color='red'
          defaultValue={initialTab}
          onChange={(value) => {
            setTab(value as TabValue);
          }}
          options={[
            { label: 'Användare', value: 'user' },
            { label: 'Admin', value: 'admin' },
          ]}
        />
      )}
      {tab === 'user' && userTab}
      {tab === 'admin' && adminTab}
    </div>
  );
};

export default NavbarControl;
