'use client';

import React, { useEffect } from 'react';
import { IconAlertTriangle, IconX } from '@tabler/icons';

export type AlertErrorProps = {
  icon?: React.ReactNode;
  title?: string;
  withCloseButton?: boolean;
  msg?: string;
  visible: boolean;
};

const AlertError = ({
  icon = <IconAlertTriangle />,
  title = 'Något gick fel!',
  withCloseButton = false,
  msg,
  visible = false,
}: AlertErrorProps) => {
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setShow(true);
      }, 100);
    }
  }, [visible]);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  return (
    <div
      className={`fixed right-4 transition-all top-20 flex flex-col items-start gap-2 p-4 text-base text-white bg-red-600 rounded-md ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className='flex items-start w-full gap-2'>
        <div className='p-0.5'>{icon}</div>
        <div className='flex-grow font-bold'>{title}</div>
        {withCloseButton && (
          <button type='button' onClick={() => setShow(false)}>
            <IconX />
          </button>
        )}
      </div>
      {msg && <div className='pl-8'>{msg}</div>}
    </div>
  );
};

export default AlertError;
