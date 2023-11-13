import Calendar from 'components/calendar';
import React from 'react';

const BookingsPage = ({
  searchParams,
}: {
  searchParams: { year: string; month: string };
}) => {
  return (
    <>
      <h2>Tarmenbokningar</h2>
      <Calendar />
    </>
  );
};

export default BookingsPage;
