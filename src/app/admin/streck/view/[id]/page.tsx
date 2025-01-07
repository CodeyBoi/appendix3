import { api } from 'trpc/server';
import AdminStreckForm, { AdminStreckFormType } from './form';
import { Suspense } from 'react';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import Tabs from 'components/input/tabs';

type AdminStreckFormPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    type: AdminStreckFormType;
  };
};

const tabOptions = [
  {
    value: 'strecklist',
    label: lang('Strecklista', 'Strecklist'),
  },
  {
    value: 'cost',
    label: lang('Kostnad', 'Cost'),
  },
  {
    value: 'deposit',
    label: lang('Insättning', 'Deposit'),
  },
];

const AdminStreckFormPage = async ({
  params: { id },
  searchParams,
}: AdminStreckFormPageProps) => {
  const isNew = id === 'new';

  const transactions = isNew
    ? []
    : (
        await api.streck.getTransactions.query({
          streckListId: +id,
        })
      ).data;

  // If transactions has exactly one type of item, this is a one-time
  // payment/deposit (aka. monolist). We handle monolists by only
  // having one item, letting the user fill in price for each corps
  // and fixing `amount` at 1.
  const isMonoList =
    new Set(transactions.map((transaction) => transaction.item)).size === 1;
  const type = isNew
    ? searchParams.type ?? 'strecklist'
    : !isMonoList
    ? 'strecklist'
    : (transactions[0]?.pricePer ?? 0) < 0
    ? 'cost'
    : 'deposit';

  const getItems = async () => {
    if (isNew) {
      switch (type) {
        case 'strecklist':
          return await api.streck.getItems.query();
        case 'deposit':
          return [{ name: 'Intäkt', price: NaN }];
        case 'cost':
          return [{ name: 'Kostnad', price: NaN }];
      }
    }
    const items = [];
    if (isMonoList) {
      const firstTransaction = transactions[0];
      if (!firstTransaction) {
        throw new Error(
          'This should be unreachable as `isMonoList === true` implies `transactions` has a length of at least 1',
        );
      }
      items.push({
        name: firstTransaction.item,
        price: NaN,
      });
    } else {
      items.push(...(await api.streck.getItems.query()));
      const itemsSet = new Set(items.map((i) => i.name));
      for (const transaction of transactions) {
        const key = transaction.item;
        if (itemsSet.has(key)) {
          continue;
        }
        itemsSet.add(key);
        items.push({ name: transaction.item, price: -transaction.pricePer });
      }
    }
    return items;
  };

  return (
    <div className='flex flex-col gap-2'>
      {isNew ? <h2>Inför transaktion</h2> : <h2>Ändra transaktion</h2>}
      {isNew && (
        <div className='max-w-md'>
          <Tabs name='type' defaultTab='strecklist' options={tabOptions} />
        </div>
      )}
      {type === 'strecklist'
        ? lang('Här inför du strecklistor.', 'Here you submit strecklists.')
        : type === 'cost'
        ? lang(
            'Här inför du kostnader för corps, t.ex. kostnader för corpsaftnar eller Pryl & Prov-prylar.',
            'Here you submit costs for corps, e.g. costs for corpsaftons or Pryl & Prov thingies.',
          )
        : type === 'deposit'
        ? lang(
            'Här inför du intäkter för corps, t.ex. insättningar eller återbäringar för utlägg.',
            'Here you submit earnings for corps, e.g. deposits or refunds for expenses.',
          )
        : undefined}
      <Suspense
        fallback={
          <Loading
            msg={lang('Hämtar strecklista...', 'Fetching strecklist...')}
          />
        }
      >
        <AdminStreckForm
          items={await getItems()}
          transactions={transactions}
          id={isNew ? undefined : +id}
          type={type}
        />
      </Suspense>
    </div>
  );
};

export default AdminStreckFormPage;
