import Calendar from 'components/calendar';
import dayjs from 'dayjs';
import React from 'react';
import { api } from 'trpc/server';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);

const getStartOfWeek = (date: Date) => {
  const day = dayjs(date);
  return day.subtract((day.day() + 6) % 7, 'day').toDate();
};

const BookingsPage = async ({
  searchParams,
}: {
  searchParams: { year: string; week: string };
}) => {
  const date = new Date();
  const year = searchParams.year
    ? parseInt(searchParams.year)
    : date.getFullYear();
  const week = searchParams.week
    ? parseInt(searchParams.week)
    : dayjs(date).week();

  const currentWeek = dayjs(
    getStartOfWeek(
      dayjs(new Date(year, 0, 1))
        .week(week)
        .toDate(),
    ),
  );
  const weekStart = currentWeek.toDate();
  const weekEnd = currentWeek.add(1, 'week').toDate();

  console.log({ weekStart, weekEnd });

  const items = await api.booking.getMany.query({
    start: weekStart,
    end: weekEnd,
    approved: true,
  });

  return (
    <>
      <h2>Tarmenbokningar</h2>
      <Calendar start={weekStart} items={items} />
    </>
  );
};

export default BookingsPage;
