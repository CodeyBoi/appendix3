import Restricted from 'components/restricted/server';
import dayjs from 'dayjs';
import { api } from 'trpc/server';
import { IconDownload, IconPencil } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import CorpsDisplay from 'components/corps/display';
import DeleteStreckListButton from './delete-streck-list';
import DownloadTransactionsButton from './download';

type StreckListTableProps = {
  start?: Date;
  end?: Date;
  take?: number;
  skip?: number;
  dateFormat?: string;
  showDelete?: boolean;
  showDownloadAll?: boolean;
};

const StreckListTable = async ({
  start,
  end,
  take,
  skip,
  dateFormat = 'YYYY-MM-DD HH:mm',
  showDelete = false,
  showDownloadAll = false,
}: StreckListTableProps) => {
  const streckLists = await api.streck.getStreckLists.query({
    start,
    end,
    take,
    skip,
    getTransactions: true,
  });

  if (streckLists.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <table className='table text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='px-1'>Typ</th>
              <th className='px-1'>Införd</th>
              <th className='px-1'>Av</th>
              <th className='px-1'>Summa</th>
              <Restricted permissions='manageStreck'>
                <th />
                {showDelete && <th />}
                <th />
              </Restricted>
            </tr>
          </thead>
          <tbody className='gap-1 divide-y divide-solid dark:divide-neutral-800'>
            {streckLists.map((streckList) => {
              return (
                <tr
                  key={streckList.id}
                  className='divide-x divide-solid dark:divide-neutral-800'
                >
                  <td className='px-2'>
                    {new Set(streckList.transactions.map((t) => t.item))
                      .size !== 1
                      ? 'Strecklista'
                      : streckList.transactions.every((t) => t.pricePer < 0)
                      ? 'Kostnad'
                      : streckList.transactions.every((t) => t.pricePer > 0)
                      ? 'Intäkt'
                      : 'Blandat'}
                  </td>
                  <td className='px-2'>
                    {dayjs(streckList.createdAt).format(dateFormat)}
                  </td>
                  <td className='px-2'>
                    <CorpsDisplay
                      corps={streckList.createdBy}
                      nameFormat='full-name'
                    />
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
                    {showDelete && (
                      <td>
                        <DeleteStreckListButton id={streckList.id} />
                      </td>
                    )}
                    <td>
                      <DownloadTransactionsButton
                        variant='subtle'
                        streckLists={[streckList]}
                        filename={`Transaktioner ${dayjs(
                          streckList.time,
                        ).format('YYYY-MM-DD')}.xlsx`}
                      >
                        <IconDownload />
                      </DownloadTransactionsButton>
                    </td>
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
