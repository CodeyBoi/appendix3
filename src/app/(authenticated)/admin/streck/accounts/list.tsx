'use client';

import { IconMailShare } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import Restricted from 'components/restricted/client';
import { Language } from 'hooks/use-language';
import Link from 'next/link';
import { useState } from 'react';
import { sortCorps, sortCorpsByName } from 'utils/corps';
import { createMailtoLink } from 'utils/email';
import { lang } from 'utils/language';

interface StreckAccount {
  id: string;
  firstName: string;
  lastName: string;
  number: number | null;
  bNumber: number | null;
  balance: number;
  email: string;
  language: string;
}

interface StreckAccountsListProps {
  balances: StreckAccount[];
}

const generateStreckMailtoLink = (account: StreckAccount) => {
  const bodyTemplates: Record<Language, string> = {
    sv: `Hej <NAME>!\n\nDu ligger nu minus på ditt strecksaldo med <NEGATIVE-BALANCE> kr och du behöver därför fylla på ditt streckkonto. Du kan göra det via bankgiro 669-8567 eller Swish 123-388 68 76. Vid Swish tillkommer avgift på 2kr som dras av från insättningen. Gör du en internationell överföring så är IBAN SE51 6000 0000 0003 6666 1272, BIC är HANDSESS.\n\nFör att Bleckhornen ska kunna drivas på ett sätt som är ekonomiskt hållbart måste medlemmar och provelever alltid sträva efter att ha ett neutralt eller positivt strecksaldo. Streckkontot är inte ett kreditkonto, utan man fyller på först och därefter streckar man. Du får inte fortsätta strecka innan du fyllt på ditt streckkonto, gör du det ändå kommer det debiteras extra. Styrelsen kan också neka dig att gå på corpsaftnar eller andra evenemang om du inte fyller på streckkontot.\n\nKul-att-strecka-fjång!`,
    en: `Hi <NAME>!\n\nYou are currently negative on your streckkonto balance by <NEGATIVE-BALANCE> SEK, and therefore need to top up. You can do this via bankgiro 669-8567 or Swish 123-388 68 76. For Swish payments, a fee of 2 SEK is deducted from the deposit. For international payments the IBAN is SE51 6000 0000 0003 6666 1272 and the BIC is HANDSESS.\n\nFor Bleckhornen to be run in a financially sustainable way, members and provelever must always strive to have a neutral or positive streckkonto balance. The streckkonto is not a credit account; you top it up first and then you may strecka. You may not continue to strecka before you have refilled your account, if you do so anyways you will be charged extra. The board may also deny you entry to corps evenings or other events if you do not top up your streckkonto.\n\nFun-to-strecka-fjång!`,
  };
  const language =
    account.language in bodyTemplates ? (account.language as Language) : 'sv';
  const subject =
    language === 'sv'
      ? 'Ditt strecksaldo är negativt'
      : 'Your streck balance is negative';
  const body = bodyTemplates[language]
    .replaceAll('<NAME>', account.firstName)
    .replaceAll('<NEGATIVE-BALANCE>', (-account.balance).toString());

  return createMailtoLink({ to: account.email, subject, body });
};

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
            className='select-none px-1 text-center hover:cursor-pointer hover:underline'
            onClick={() => {
              setSort('number');
            }}
          >
            #{sortBy === 'number' && orderIcon}
          </th>
          <th
            className='select-none px-1 hover:cursor-pointer hover:underline'
            onClick={() => {
              setSort('firstName');
            }}
          >
            {lang('Förnamn', 'First name')}
            {sortBy === 'firstName' && orderIcon}
          </th>
          <th
            className='select-none px-1 hover:cursor-pointer hover:underline'
            onClick={() => {
              setSort('lastName');
            }}
          >
            {lang('Efternamn', 'Surname')}
            {sortBy === 'lastName' && orderIcon}
          </th>
          <th
            className='select-none px-1 hover:cursor-pointer hover:underline'
            onClick={() => {
              setSort('balance');
            }}
          >
            {lang('Strecksaldo', 'Streck balance')}
            {sortBy === 'balance' && orderIcon}
          </th>
          <Restricted permissions='manageStreck'>
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
            <td className='px-1 text-right'>
              <Link
                className='hover:cursor-pointer hover:underline'
                href={`accounts/${corps.id}`}
              >
                {corps.balance.toString()}
              </Link>
            </td>
            <Restricted permissions='manageStreck'>
              <td>
                {corps.balance < 0 && (
                  <a href={generateStreckMailtoLink(corps)}>
                    <ActionIcon variant='subtle'>
                      <IconMailShare />
                    </ActionIcon>
                  </a>
                )}
              </td>
            </Restricted>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StreckAccountsList;
