interface GigSkeletonProps {
  widths?: number[];
}

const GigSkeleton = ({ widths = [] }: GigSkeletonProps) => {
  const [titleWidth = 200, typeWidth = 120, locationWidth = 95, textW = 0.6] =
    widths;
  const textWidth = `${Math.floor(textW * 100)}%`;
  return (
    <div className='rounded border border-neutral-500/20 shadow-md'>
      <div className='flex animate-pulse flex-col space-y-2 p-4'>
        <div className='flex flex-nowrap content-start justify-between'>
          <div
            className='my-1 h-6 rounded bg-gray-500/20'
            style={{ width: titleWidth }}
          />
        </div>
        <div className='flex flex-col justify-between md:flex-row'>
          <div className='flex grow'>
            <div className='flex grow flex-row items-center space-x-4'>
              <div className='m-1 h-20 w-14 rounded-sm bg-gray-500/20' />
              <div>
                <div
                  className='my-1 h-2 w-24 rounded bg-gray-500/20'
                  style={{ width: typeWidth }}
                />
                <div
                  className='my-1 h-2 w-24 rounded bg-gray-500/20'
                  style={{ width: locationWidth }}
                />
                <div className='my-1 h-2 w-20 rounded bg-gray-500/20' />
                <div className='my-1 h-2 w-24 rounded bg-gray-500/20' />
              </div>
            </div>
          </div>
        </div>
        <div className='h-3 rounded bg-gray-500/20' />
        <div
          className='h-3 rounded bg-gray-500/20'
          style={{ width: textWidth }}
        />
      </div>
    </div>
  );
};

export default GigSkeleton;
