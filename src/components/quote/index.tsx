import { Quote } from '@prisma/client';
import { IconPencil } from '@tabler/icons-react';
import Link from 'next/link';
import { trpc } from '../../utils/trpc';

interface QuoteProps {
  quote: Quote & {
    saidBy: {
      lastName: string;
      number: number | null;
    };
    writtenBy: { firstName: string; lastName: string; number: number | null };
  };
}

const Quote = ({ quote }: QuoteProps) => {
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const corpsId = corps?.id;
  const { lastName, number } = quote.saidBy;
  const saidByName = `${
    number !== null ? '#' + number.toString() : 'p.e. ' + lastName
  }`;
  const writtenByName = `${
    (quote.writtenBy.number !== null
      ? '#' + quote.writtenBy.number.toString()
      : 'p.e.') +
    ' ' +
    quote.writtenBy.firstName +
    ' ' +
    quote.writtenBy.lastName
  }`;
  const ownQuote =
    corpsId === quote.saidByCorpsId || corpsId === quote.writtenByCorpsId;
  const time = new Date(quote.createdAt).toLocaleString('sv-SE', {
    timeZone: 'Europe/Stockholm',
    hour: 'numeric',
    minute: 'numeric',
  });
  return (
    <div className='flex flex-nowrap'>
      <div className='flex-grow pl-3'>
        <div className='flex items-baseline space-x-1'>
          <div className='font-bold'>{writtenByName}</div>
          <div className='text-xs font-thin text-gray-500'>{time}</div>
        </div>
        {`${saidByName}: `}
        <i>{`${quote.quote}`}</i>
      </div>
      {ownQuote && (
        <Link href={`/quotes/${quote.id}`}>
          <div className='text-red-600'>
            <IconPencil />
          </div>
        </Link>
      )}
    </div>
  );
};

export default Quote;
