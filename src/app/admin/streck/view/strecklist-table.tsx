import Restricted from 'components/restricted/server';
import dayjs from 'dayjs';
import { api } from 'trpc/server';
import { IconPencil } from '@tabler/icons-react';
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
  showDownload?: boolean;
};

const StreckListTable = async ({
  start,
  end,
  take,
  skip,
  dateFormat = 'YYYY-MM-DD HH:mm',
  showDelete = false,
  showDownload = false,
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
      {showDownload && (
        <DownloadTransactionsButton
          streckLists={streckLists}
          filename={`Strecklistor ${dayjs(start).format(
            'YYYY-MM-DD',
          )} - ${dayjs(end).format('YYYY-MM-DD')}.xlsx`}
        />
      )}
      <div>
        <table className='table text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='px-1'>Införd</th>
              <th className='px-1'>Av</th>
              <th className='px-1'>Summa</th>
              <th />
              {showDelete && (
                <Restricted permissions={'manageStreck'}>
                  <th />
                </Restricted>
              )}
            </tr>
          </thead>
          <tbody className='gap-1 divide-y divide-solid dark:divide-neutral-800'>
            {streckLists.map((streckList) => (
              <tr
                key={streckList.id}
                className='divide-x divide-solid dark:divide-neutral-800'
              >
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
                <td className='px-2'>
                  <ActionIcon
                    href={`/admin/streck/view/${streckList.id}`}
                    variant='subtle'
                  >
                    <IconPencil />
                  </ActionIcon>
                </td>
                {showDelete && (
                  <Restricted permissions={'manageStreck'}>
                    <td className='px-2'>
                      <DeleteStreckListButton id={streckList.id} />
                    </td>
                  </Restricted>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StreckListTable;
