import Calendar from 'components/calendar';
import React from 'react';

const items = [
  {
    title: 'Bokning 1',
    start: new Date(2023, 8, 1, 12),
    end: new Date(2023, 8, 1, 13),
  },
  {
    title: 'Bokning 2',
    start: new Date(2023, 8, 1, 14),
    end: new Date(2023, 8, 1, 15),
  },
  {
    title: 'Bokning 3',
    start: new Date(2023, 8, 1, 16),
    end: new Date(2023, 8, 1, 17),
  },
  {
    title: 'Bokning 4',
    start: new Date(2023, 8, 1, 18),
    end: new Date(2023, 8, 1, 19),
  },
  {
    title: 'Bokning 5',
    start: new Date(2023, 8, 1, 20),
    end: new Date(2023, 8, 1, 21),
  },
  {
    title: 'Bokning 6',
    start: new Date(2023, 8, 1, 22),
    end: new Date(2023, 8, 1, 23),
  },
  {
    title: 'Bokning 7',
    start: new Date(2023, 8, 1, 23),
    end: new Date(2023, 8, 2, 0),
  },
  {
    title: 'Bokning 8',
    start: new Date(2023, 8, 2, 1),
    end: new Date(2023, 8, 2, 2),
  },
  {
    title: 'Bokning 9',
    start: new Date(2023, 8, 2, 3),
    end: new Date(2023, 8, 2, 4),
  },
  {
    title: 'Bokning 10',
    start: new Date(2023, 8, 2, 5),
    end: new Date(2023, 8, 2, 6),
  },
];

const BookingsPage = ({
  searchParams,
}: {
  searchParams: { year: string; month: string };
}) => {
  const date = new Date();
  const year = searchParams.year
    ? parseInt(searchParams.year)
    : date.getFullYear();
  const month = searchParams.month
    ? parseInt(searchParams.month)
    : date.getMonth();
  return (
    <>
      <h2>Tarmenbokningar</h2>
      <Calendar year={year} month={month} items={items} />
    </>
  );
};

export default BookingsPage;
