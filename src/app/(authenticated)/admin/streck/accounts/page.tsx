import ParamsDatePicker from 'components/input/params-date-picker';
import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import { lang } from 'utils/language';
import StreckBalancesList from './list';
import { api } from 'trpc/server';
import Loading from 'components/loading';

interface StreckAccountsPageProps {
  currentTime: Date;
  searchParams: {
    start?: string;
    end?: string;
  };
}

const StreckBalancesPage = async ({
  currentTime = new Date(),
  searchParams,
}: StreckAccountsPageProps) => {
  const start = (
    searchParams.start
      ? dayjs(searchParams.start)
      : dayjs(currentTime).subtract(1, 'month')
  )
    .startOf('day')
    .toDate();
  const end = dayjs(searchParams.end ?? currentTime)
    .startOf('day')
    .toDate();

  return (
    <div className='flex max-w-xl flex-col gap-4'>
      <h2>{lang('Streckkonton', 'Streck Accounts')}</h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <ParamsDatePicker
          paramName='start'
          defaultValue={start}
          label={lang(
            'Se konton aktiva från och med:',
            'View accounts active from:',
          )}
        />
        <ParamsDatePicker
          paramName='end'
          defaultValue={end}
          label={lang('till och med:', 'until:')}
        />
      </div>
      <Suspense
        fallback={
          <Loading
            msg={lang('Hämtar streckkonton...', 'Fetching streck accounts...')}
          />
        }
      >
        <div className='overflow-x-auto'>
          <StreckBalancesList
            balances={await api.streck.getCorpsBalances.query({
              activeFrom: start,
              activeUntil: end,
            })}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default StreckBalancesPage;
