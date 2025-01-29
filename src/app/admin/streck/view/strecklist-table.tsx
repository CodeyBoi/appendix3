import Restricted from 'components/restricted/server';
import dayjs from 'dayjs';
import { api } from 'trpc/server';
import { IconDownload, IconPencil } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import DeleteStreckListButton from './delete-streck-list';
import DownloadTransactionsButton from './download';
import { numberAndFullName } from 'utils/corps';
import RestoreStreckListButton from './restore-streck-list';
import { lang } from 'utils/language';

interface StreckListTableProps {
  start?: Date;
  end?: Date;
  take?: number;
  skip?: number;
  dateFormat?: string;
  showDelete?: boolean;
  showDownloadAll?: boolean;
  showDeleted?: boolean;
}

const StreckListTable = async ({
  start,
  end,
  take,
  skip,
  dateFormat = 'YYYY-MM-DD HH:mm',
  showDelete = false,
  showDownloadAll = false,
  showDeleted = false,
}: StreckListTableProps) => {
  const streckLists = await api.streck.getStreckLists.query({
    start,
    end,
    take,
    skip,
    getTransactions: true,
    deleted: showDeleted,
  });

  if (streckLists.length === 0) {
    return <h4 className='italic'>Här var det tomt...</h4>;
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='overflow-x-auto overflow-y-hidden'>
        <table className='table text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='px-1'>Typ</th>
              <th className='px-1'>Införd</th>
              <th className='px-1'>Av</th>
              <th className='px-1'>Summa</th>
              <Restricted permissions='manageStreck'>
                <th />
                {showDeleted && <th />}
                {showDelete && <th />}
                <th />
              </Restricted>
            </tr>
          </thead>
          <tbody className='gap-1 divide-y divide-solid dark:divide-neutral-800'>
            {streckLists.map((streckList) => {
              const listType =
                new Set(streckList.transactions.map((t) => t.item)).size !== 1
                  ? 'strecklist'
                  : streckList.transactions.every((t) => t.pricePer < 0)
                  ? 'cost'
                  : streckList.transactions.every((t) => t.pricePer > 0)
                  ? 'deposit'
                  : 'unknown';
              return (
                <tr
                  key={streckList.id}
                  className='divide-x divide-solid whitespace-nowrap dark:divide-neutral-800'
                >
                  <td className='px-2'>
                    {listType === 'strecklist'
                      ? lang('Strecklista', 'Strecklist')
                      : listType === 'cost'
                      ? lang('Kostnad', 'Cost')
                      : listType === 'deposit'
                      ? lang('Intäkt', 'Income')
                      : lang('Blandat', 'Mixed')}
                  </td>
                  <td className='px-2'>
                    {dayjs(streckList.time).format(dateFormat)}
                  </td>
                  <td className='px-2'>
                    {numberAndFullName(streckList.createdBy)}
                  </td>
                  <td className='px-2 text-right'>{streckList.totalChange}</td>
                  <Restricted permissions='manageStreck'>
                    <td>
                      <ActionIcon
                        href={`/admin/streck/view/${streckList.id}`}
                        variant='subtle'
                      >
                        <IconPencil />
                      </ActionIcon>
                    </td>
                    <td>
                      {listType === 'strecklist' ? (
                        <ActionIcon
                          href={`/api/trpc/streck.exportStreckList?input=${encodeURIComponent(
                            JSON.stringify({ json: { id: streckList.id } }),
                          )}`}
                          variant='subtle'
                        >
                          <IconDownload />
                        </ActionIcon>
                      ) : (
                        <DownloadTransactionsButton
                          variant='subtle'
                          streckLists={[streckList]}
                          filename={`Transaktioner ${dayjs(
                            streckList.time,
                          ).format('YYYY-MM-DD_HH-mm')}.xlsx`}
                        >
                          <IconDownload />
                        </DownloadTransactionsButton>
                      )}
                    </td>
                    {showDeleted && (
                      <td>
                        <RestoreStreckListButton id={streckList.id} />
                      </td>
                    )}
                    {showDelete && (
                      <td>
                        <DeleteStreckListButton
                          id={streckList.id}
                          properRemove={showDeleted}
                        />
                      </td>
                    )}
                  </Restricted>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showDownloadAll && (
        <DownloadTransactionsButton
          streckLists={streckLists}
          filename={`Transaktioner ${dayjs(start).format(
            'YYYY-MM-DD',
          )} - ${dayjs(end).format('YYYY-MM-DD')}.xlsx`}
        >
          <IconDownload />
          Exportera alla
        </DownloadTransactionsButton>
      )}
    </div>
  );
};

export default StreckListTable;
