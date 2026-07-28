import { api } from 'trpc/server';
import AdminStreckForm, { AdminStreckFormType } from './form';
import { Suspense } from 'react';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import Tabs from 'components/input/tabs';

interface AdminStreckFormPageProps {
  params: {
    id: string;
  };
  searchParams: {
    type: AdminStreckFormType;
  };
}

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

  const streckList = isNew
    ? undefined
    : await api.streck.get.query({ id: +id });
  const transactions = streckList?.transactions ?? [];

  // If transactions has exactly one type of item, this is a one-time
  // payment/deposit (aka. monolist). We handle monolists by only
  // having one item, letting the user fill in price for each corps
  // and fixing `amount` at 1.
  const isMonoList =
    new Set(transactions.map((transaction) => transaction.item)).size === 1;
  const type = isNew
    ? searchParams.type
    : !isMonoList
    ? 'strecklist'
    : transactions.every((t) => t.pricePer < 0)
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

  if (!isNew && !streckList) {
    return (
      <h3>
        {lang(
          `Det finns ingen lista med id ${id}.`,
          `No list with id ${id} exists.`,
        )}
      </h3>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {isNew ? (
        <h2>{lang('Ny transaktion', 'New transaction')}</h2>
      ) : (
        <h2>{lang('Ändra transaktion', 'Edit transaction')}</h2>
      )}
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
        : lang(
            'Här inför du intäkter för corps, t.ex. insättningar eller återbäringar för utlägg.',
            'Here you submit earnings for corps, e.g. deposits or refunds for expenses.',
          )}
      <Suspense
        fallback={
          <Loading
            msg={lang('Hämtar strecklista...', 'Fetching strecklist...')}
          />
        }
      >
        <AdminStreckForm
          streckList={streckList || undefined}
          items={await getItems()}
          type={type}
        />
      </Suspense>
    </div>
  );
};

export default AdminStreckFormPage;
