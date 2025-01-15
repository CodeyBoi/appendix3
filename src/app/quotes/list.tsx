import Quote, { QuoteType } from 'components/quote';
import React from 'react';

const getDayMessage = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const otherDate = new Date(date);
  otherDate.setHours(0, 0, 0, 0);
  const diff = today.getTime() - otherDate.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return 'Idag';
  } else if (diffDays === 1) {
    return 'Igår';
  } else if (diffDays === 2) {
    return 'I förrgår';
  } else {
    return otherDate.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
};

const QuotePage = ({ quotes }: { quotes: QuoteType[] }) => {
  let prevDayMessage: string | undefined;
  return (
    <table className='text-base'>
      <tbody>
        {quotes.map((quote) => {
          const dayMessage = getDayMessage(new Date(quote.createdAt));
          let shouldAddDayMessage = false;
          if (prevDayMessage !== dayMessage) {
            shouldAddDayMessage = true;
            prevDayMessage = dayMessage;
          }
          return (
            <React.Fragment key={quote.id}>
              {shouldAddDayMessage && (
                <tr style={{ backgroundColor: 'unset' }}>
                  <td colSpan={12}>
                    <h3 className='mt-3'>{dayMessage}</h3>
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ border: '0' }}>
                  <Quote quote={quote} />
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default QuotePage;
