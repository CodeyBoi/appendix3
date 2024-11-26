import CorpsDisplay from 'components/corps/display';
import Restricted from 'components/restricted';
import dayjs from 'dayjs';
import { api } from 'trpc/server';
import DeleteTransactionButton from './delete';

type CorpsOrListId = string | number;

type TransactionsTableProps = {
  sourceId: CorpsOrListId;
  showCorps?: boolean;
  dateFormat?: string;
  showDelete?: boolean;
  showDownload?: boolean;
};

const getTransactions = async (sourceId: CorpsOrListId) => {
  if (typeof sourceId === 'number') {
    return api.streck.getTransactions.query({ streckListId: sourceId });
  } else {
    return api.streck.getTransactions.query({ corpsId: sourceId });
  }
};

const TransactionsTable = async ({
  sourceId,
  showCorps = false,
  dateFormat = 'YYYY-MM-DD',
  showDelete = false,
  showDownload = false,
}: TransactionsTableProps) => {
  const transactions = await getTransactions(sourceId);

  if (transactions.data.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-col gap-4'>
      {showDownload && <div>TODO: ADD DOWNLOAD</div>}
      <div>
        <table className='table text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='px-1'>Datum</th>
              {showCorps && <th className='px-1'>Corps</th>}
              <th className='px-1'>Artikel</th>
              <th className='px-1'>Styckpris</th>
              <th className='px-1'>Antal</th>
              <th className='px-1'>Total</th>
              {showDelete && (
                <Restricted permissions={'manageStreck'}>
                  <th />
                </Restricted>
              )}
            </tr>
          </thead>
          <tbody className='gap-1 divide-y divide-solid dark:divide-neutral-800'>
            {transactions.data.map((transaction) => (
              <tr
                key={transaction.id}
                className='divide-x divide-solid dark:divide-neutral-800'
              >
                <td className='px-2'>
                  {dayjs(transaction.time).format(dateFormat)}
                </td>
                {showCorps && (
                  <td className='px-2'>
                    <CorpsDisplay
                      corps={transaction.corps}
                      nameFormat='full-name'
                    />
                  </td>
                )}
                <td className='px-2'>{transaction.item}</td>
                <td className='px-2 text-right'>{transaction.pricePer}</td>
                <td className='px-2 text-right'>{transaction.amount}</td>
                <td className='px-2 text-right'>{transaction.totalPrice}</td>
                {showDelete && (
                  <Restricted permissions={'manageStreck'}>
                    <td className='px-2'>
                      <DeleteTransactionButton id={transaction.id} />
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

export default TransactionsTable;
