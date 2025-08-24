'use client';

import { IconMailShare } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import Restricted from 'components/restricted/client';
import { useState } from 'react';
import { sortCorps, sortCorpsByName } from 'utils/corps';
import { lang } from 'utils/language';

interface StreckAccount {
  id: string;
  firstName: string;
  lastName: string;
  number: number | null;
  bNumber: number | null;
  balance: number;
}

interface StreckAccountsListProps {
  balances: StreckAccount[];
}

type SortBy = 'firstName' | 'lastName' | 'balance' | 'number';

const sortingFunctions: Record<
  SortBy,
  (a: StreckAccount, b: StreckAccount) => number
> = {
  lastName: sortCorpsByName,
  firstName: (a, b) => {
    const firstNameCmp = a.firstName.localeCompare(b.firstName, 'sv');
    if (firstNameCmp !== 0) {
      return firstNameCmp;
    } else {
      return a.lastName.localeCompare(b.lastName, 'sv');
    }
  },
  balance: (a, b) => a.balance - b.balance,
  number: sortCorps,
};

const StreckAccountsList = ({ balances }: StreckAccountsListProps) => {
  const [sortBy, setSortBy] = useState('lastName' as SortBy);
  const [order, setOrder] = useState('asc');

  const sortFunc = sortingFunctions[sortBy];

  const setSort = (sort: SortBy) => {
    if (sort === sortBy) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrder('asc');
    }
    setSortBy(sort);
  };

  const balancesSorted = balances.sort(sortFunc);
  if (order === 'desc') {
    balancesSorted.reverse();
  }

  const orderIcon = order === 'asc' ? '↑' : '↓';

  return (
    <table className='table w-min table-auto'>
      <thead>
        <tr className='divide-x divide-solid border-b text-left dark:divide-neutral-800'>
          <th
            className='select-none px-1 text-center hover:cursor-pointer'
            onClick={() => {
              setSort('number');
            }}
          >
            #{sortBy === 'number' && orderIcon}
          </th>
          <th
            className='select-none px-1 hover:cursor-pointer'
            onClick={() => {
              setSort('firstName');
            }}
          >
            {lang('Förnamn', 'First name')}
            {sortBy === 'firstName' && orderIcon}
          </th>
          <th
            className='select-none px-1 hover:cursor-pointer'
            onClick={() => {
              setSort('lastName');
            }}
          >
            {lang('Efternamn', 'Surname')}
            {sortBy === 'lastName' && orderIcon}
          </th>
          <th
            className='select-none px-1 hover:cursor-pointer'
            onClick={() => {
              setSort('balance');
            }}
          >
            {lang('Strecksaldo', 'Streck balance')}
            {sortBy === 'balance' && orderIcon}
          </th>
          <Restricted permissions='manageStreck'>
            <th className='px-1' />
            <th className='px-1' />
          </Restricted>
        </tr>
      </thead>

      <tbody className='divide-y divide-solid dark:divide-neutral-800'>
        {balancesSorted.map((corps) => (
          <tr
            key={corps.id}
            className='divide-x divide-solid dark:divide-neutral-800'
          >
            <td className='px-1 text-right'>
              {corps.number?.toString() ??
                (corps.bNumber ? 'b' + corps.bNumber.toString() : '')}
            </td>
            <td className='px-1 md:whitespace-nowrap'>
              {corps.firstName.trim()}
            </td>
            <td className='px-1 md:whitespace-nowrap'>
              {corps.lastName.trim()}
            </td>
            <td className='px-1 text-right'>{corps.balance.toString()}</td>
            <Restricted permissions='manageStreck'>
              <td>
                <ActionIcon variant='subtle'>
                  <IconMailShare />
                </ActionIcon>
              </td>
            </Restricted>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StreckAccountsList;
