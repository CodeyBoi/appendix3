import React from 'react';

const genRandom = (min: number, max: number, step = 1) => {
  const range = max - min;
  const steps = range / step;
  const randomStep = Math.floor(Math.random() * steps);
  return min + randomStep * step;
};

const GigSkeleton = () => {
  const titleWidth = genRandom(100, 300);
  const typeWidth = genRandom(70, 170);
  const locationWidth = genRandom(50, 140);
  const textWidth = (Math.random() * 100).toString() + '%';

  return (
    <div className='border rounded shadow-md'>
      <div className='flex flex-col p-4 space-y-2 animate-pulse'>
        <div className='flex content-start justify-between flex-nowrap'>
          <div
            className='h-6 mt-1 mb-1 bg-gray-200 rounded'
            style={{ width: titleWidth }}
          />
        </div>
        <div className='flex flex-col justify-between md:flex-row'>
          <div className='flex flex-grow'>
            <div className='flex flex-row items-center flex-grow space-x-4'>
              <div className='h-20 m-1 bg-gray-200 border rounded-sm w-14' />
              <div>
                <div
                  className='w-24 h-2 mt-1 mb-1 bg-gray-200 rounded'
                  style={{ width: typeWidth }}
                />
                <div
                  className='w-24 h-2 mt-1 mb-1 bg-gray-200 rounded'
                  style={{ width: locationWidth }}
                />
                <div className='w-20 h-2 mt-1 mb-1 bg-gray-200 rounded' />
                <div className='w-24 h-2 mt-1 mb-1 bg-gray-200 rounded' />
              </div>
            </div>
          </div>
        </div>
        <div className='h-3 bg-gray-200 rounded' />
        <div className='h-3 bg-gray-200 rounded' style={{ width: textWidth }} />
      </div>
    </div>
  );
};

export default GigSkeleton;
