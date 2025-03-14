'use client';

import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import Button from 'components/input/button';
import { useSearchParamsState } from 'hooks/use-search-params-state';

const QuotePageControl = ({ defaultPage = '1' }: { defaultPage: string }) => {
  const [page, setPage] = useSearchParamsState('page', defaultPage);
  return (
    <div className='flex items-center justify-between'>
      {+page > 1 && (
        <Button
          onClick={() => {
            setPage(Math.max(1, +page - 1).toString());
          }}
        >
          <div className='h-min w-min cursor-pointer rounded bg-red-600 p-1 text-white hover:bg-red-700'>
            <IconArrowLeft />
          </div>
        </Button>
      )}
      <span>Sida {page}</span>
      <Button
        onClick={() => {
          setPage((+page + 1).toString());
        }}
      >
        <div className='h-min w-min cursor-pointer rounded bg-red-600 p-1 text-white hover:bg-red-700'>
          <IconArrowRight />
        </div>
      </Button>
    </div>
  );
};

export default QuotePageControl;
