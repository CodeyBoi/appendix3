'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from 'components/input/button';
import CorpsForm from 'components/corps-form';
import SelectCorps from 'components/select-corps';

const ViewCorps = () => {
  const [corpsId, setCorpsId] = useState<string | null>(null);
  return (
    <div className='flex max-w-lg flex-col gap-2'>
      <h1>Corps</h1>
      <div className='max-w-max'>
        <Link href='/admin/corps/new'>
          <Button>Skapa corps</Button>
        </Link>
      </div>
      <div className='h-2' />
      <h2>Uppdatera corps</h2>
      <SelectCorps placeholder='Välj corps...' onChange={setCorpsId} />
      {corpsId !== null && (
        <div className='rounded border p-2 shadow-md dark:border-neutral-800'>
          <CorpsForm corpsId={corpsId} />
        </div>
      )}
    </div>
  );
};

export default ViewCorps;
