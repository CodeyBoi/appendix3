import { toStreckListMatrix } from 'server/trpc/router/streck';
import { api } from 'trpc/server';
import { lang } from 'utils/language';
import { getStreckListType } from 'utils/streck';

interface StreckListProps {
  id: number;
}

const StreckList = async ({ id }: StreckListProps) => {
  const streckList = await api.streck.get.query({ id });

  if (!streckList) {
    return (
      <h3>
        {lang(
          'Det finns ingen strecklista med id: ',
          'No streck list exists with id: ',
        )}
        {id.toString()}
      </h3>
    );
  }

  const listType = getStreckListType(streckList.transactions);

  if (listType === 'strecklist') {
    const { corpsii, items } = toStreckListMatrix(streckList.transactions);

    return (
      <table className='table-auto'>
        <thead>
          <tr className='divide-x divide-solid border-b text-left align-bottom text-xs dark:divide-neutral-800'>
            <th className='px-1 text-center'>#</th>
            <th className='px-1'>{lang('Förnamn', 'First name')}</th>
            <th className='px-1'>{lang('Efternamn', 'Surname')}</th>
            {items.map((item) => (
              <th className='text-wrap w-min px-1'>{item}</th>
            ))}
          </tr>
        </thead>

        <tbody className='divide-y divide-solid text-sm dark:divide-neutral-800'>
          {corpsii.map(({ corps, amounts }) => (
            <tr className='divide-x divide-solid dark:divide-neutral-800'>
              <td className='px-1 text-right'>
                {corps.number?.toString() ??
                  (corps.bNumber ? 'b' + corps.bNumber.toString() : '')}
              </td>
              <td className='px-1'>{corps.firstName.trim()}</td>
              <td className='px-1'>{corps.lastName.trim()}</td>
              {items.map((item) => (
                <td className='px-1 text-right'>
                  {amounts.get(item)?.toString() ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    return (
      <table className='table-auto'>
        <thead>
          <tr className='divide-x divide-solid border-b text-left align-bottom text-xs dark:divide-neutral-800'>
            <th className='px-1 text-center'>#</th>
            <th className='px-1'>{lang('Förnamn', 'First name')}</th>
            <th className='px-1'>{lang('Efternamn', 'Surname')}</th>
            <th className='px-1'>{lang('Kostnad', 'Cost')}</th>
            {listType === 'deposit' && (
              <th className='px-1'>
                {lang('Verifikatsnr.', 'Verification nr.')}
              </th>
            )}
            <th className='px-1'>{lang('Anteckning', 'Note')}</th>
          </tr>
        </thead>

        <tbody className='divide-y divide-solid text-sm dark:divide-neutral-800'>
          {streckList.transactions
            .sort(
              (a, b) =>
                a.verificationNumber?.localeCompare(
                  b.verificationNumber ?? '',
                ) ?? -1,
            )
            .map(({ corps, pricePer, verificationNumber, note }) => (
              <tr className='divide-x divide-solid dark:divide-neutral-800'>
                <td className='px-1 text-right'>
                  {corps.number?.toString() ??
                    (corps.bNumber ? 'b' + corps.bNumber.toString() : '')}
                </td>
                <td className='px-1'>{corps.firstName.trim()}</td>
                <td className='px-1'>{corps.lastName.trim()}</td>
                <td className='px-1'>{Math.abs(pricePer)}</td>
                {listType === 'deposit' && verificationNumber && (
                  <td className='px-1'>{verificationNumber}</td>
                )}
                <td className='px-1'>{note}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }
};

export default StreckList;
