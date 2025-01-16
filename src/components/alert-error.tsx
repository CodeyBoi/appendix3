'use client';

import React, { useEffect } from 'react';
import { IconAlertTriangle, IconX } from '@tabler/icons-react';

export interface AlertErrorProps {
  icon?: React.ReactNode;
  title?: string;
  withCloseButton?: boolean;
  msg?: string;
  visible: boolean;
}

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
      className={`fixed right-4 top-20 flex flex-col items-start gap-2 rounded-md bg-red-600 p-4 text-base text-white transition-all ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className='flex w-full items-start gap-2'>
        <div className='p-0.5'>{icon}</div>
        <div className='grow font-bold'>{title}</div>
        {withCloseButton && (
          <button
            type='button'
            onClick={() => {
              setShow(false);
            }}
          >
            <IconX />
          </button>
        )}
      </div>
      {msg && <div className='pl-8'>{msg}</div>}
    </div>
  );
};

export default AlertError;
