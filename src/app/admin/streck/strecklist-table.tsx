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
import Tooltip from 'components/tooltip';
import Link from 'next/link';
import { getStreckListType } from 'utils/streck';

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
      <div className='overflow-x-auto overflow-y-hidden pt-4'>
        <div className='table text-sm'>
          <div className='table-header-group'>
            <div className='table-row divide-x divide-solid text-left dark:divide-neutral-800'>
              <div className='table-cell px-1'>Typ</div>
              <div className='table-cell px-1'>Införd</div>
              <div className='table-cell px-1'>Av</div>
              <div className='table-cell px-1'>Summa</div>
              <Restricted permissions='manageStreck'>
                <div className='table-cell' />
                {showDeleted && <div className='table-cell' />}
                {showDelete && <div className='table-cell' />}
                <div className='table-cell' />
              </Restricted>
            </div>
          </div>
          <div className='table-row-group gap-1'>
            {streckLists.map((streckList) => {
              const listType = getStreckListType(streckList.transactions);
              const link = `/admin/streck/view/${streckList.id}`;
              return (
                <div
                  key={streckList.id}
                  className='table-row divide-x divide-y divide-solid whitespace-nowrap hover:cursor-pointer hover:bg-red-300/5 dark:divide-neutral-800'
                >
                  <div className='table-cell border-t px-2 align-middle dark:border-neutral-800'>
                    {listType === 'strecklist'
                      ? lang('Strecklista', 'Strecklist')
                      : listType === 'cost'
                      ? lang('Kostnad', 'Cost')
                      : listType === 'deposit'
                      ? lang('Intäkt', 'Income')
                      : lang('Blandat', 'Mixed')}
                  </div>
                  <Link href={link} className='table-cell px-2 align-middle'>
                    {dayjs(streckList.time).format(dateFormat)}
                  </Link>
                  <Link href={link} className='table-cell px-2 align-middle'>
                    {numberAndFullName(streckList.createdBy)}
                  </Link>
                  <Link
                    href={link}
                    className='table-cell px-2 text-right align-middle'
                  >
                    {streckList.totalChange}
                  </Link>
                  <Restricted permissions='manageStreck'>
                    <div className='table-cell'>
                      <Tooltip text={lang('Uppdatera', 'Edit')}>
                        <ActionIcon
                          href={`/admin/streck/edit/${streckList.id}`}
                          variant='subtle'
                        >
                          <IconPencil />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                  </Restricted>
                  <div className='table-cell'>
                    <Tooltip
                      text={lang('Exportera som XLSX', 'Export as XLSX')}
                    >
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
                    </Tooltip>
                  </div>
                  <Restricted permissions='manageStreck'>
                    {showDeleted && (
                      <div className='table-cell'>
                        <Tooltip text={lang('Återställ', 'Restore')}>
                          <RestoreStreckListButton id={streckList.id} />
                        </Tooltip>
                      </div>
                    )}
                    {showDelete && (
                      <div className='table-cell'>
                        <Tooltip
                          text={lang(
                            showDeleted ? 'Ta bort permanent' : 'Ta bort',
                            showDeleted ? 'Remove permanently' : 'Remove',
                          )}
                        >
                          <DeleteStreckListButton
                            id={streckList.id}
                            properRemove={showDeleted}
                          />
                        </Tooltip>
                      </div>
                    )}
                  </Restricted>
                </div>
              );
            })}
          </div>
        </div>
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
