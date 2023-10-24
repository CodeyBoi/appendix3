import React from 'react';
import Loading from './loading';

interface LoadingOverlayProps {
  children: React.ReactNode;
  msg?: string;
  visible: boolean;
}

const LoadingOverlay = (props: LoadingOverlayProps) => {
  // This element should be placed as a parent to the element that should be
  // overlayed with a loading screen.
  return (
    <div className='relative p-2 rounded'>
      {props.children}
      {props.visible && (
        <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded'>
          <div className='flex flex-col items-center justify-center'>
            <Loading msg={props.msg} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
