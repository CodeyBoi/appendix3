import React from 'react';
import Loading from './loading';

interface LoadingOverlayProps {
  children: React.ReactNode;
  msg?: string;
  visible: boolean;
  showSpinner?: boolean;
}

const LoadingOverlay = ({
  children,
  visible,
  msg,
  showSpinner = true,
}: LoadingOverlayProps) => {
  // This element should be placed as a parent to the element that should be
  // overlayed with a loading screen.
  return (
    <div className='relative p-2 rounded'>
      {children}
      {visible && (
        <div className='absolute inset-0 flex items-center justify-center rounded bg-white/50 dark:bg-darkBg/50'>
          <div className='flex flex-col items-center justify-center'>
            {showSpinner && <Loading msg={msg} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
