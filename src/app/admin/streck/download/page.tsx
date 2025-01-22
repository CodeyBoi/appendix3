import { api } from 'trpc/server';
import { getDistinct } from 'utils/array';
import { lang } from 'utils/language';

interface DownloadStreckListPageProps {
  searchParams: {
    id?: string;
  };
}

interface Corps {
  number: number | null;
  firstName: string;
  lastName: string;
  balance: number;
}

interface Transaction {
  corps: Corps;
  item: string;
  pricePer: number;
  amount: number;
  totalPrice: number;
  verificationNumber: string | null;
  note: string;
}

interface StreckList {
  transactions: Transaction[];
  time: Date;
  createdBy: Corps;
  createdAt: Date;
}

const exportStreckList = async (streckList: StreckList) => {
  const corpsBalances = await api.streck.getCorpsBalances.query({
    time: streckList.time,
  });

  const passiveCorpsBalances = await api.streck.getCorpsBalances.query({
    activeFrom: new Date('2024-01-01'), // Strecklistan started existing at blindtarmen 2024-12-16
    excludeCorps: corpsBalances.map((c) => c.id),
  });

  const items = getDistinct(
    streckList.transactions.map((t) => ({
      name: t.item,
      pricePer: -t.pricePer,
    })),
  );
};

const DownloadStreckListPage = async ({
  searchParams,
}: DownloadStreckListPageProps) => {
  const id = parseInt(searchParams.id ?? '');

  if (isNaN(id)) {
    return <h3>{lang('Ogiltigt strecklist-id', 'Invalid strecklist id')}</h3>;
  }

  const streckList = await api.streck.getStreckList.query({
    id,
  });

  if (!streckList) {
    return (
      <h3>
        {lang(
          'Det existerar ingen strecklista med id ',
          'No strecklist exists with id ',
        )}
        {id.toString()}
      </h3>
    );
  }
};
