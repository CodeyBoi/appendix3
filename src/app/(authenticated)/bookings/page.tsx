'use client';

import Calendar from 'components/calendar';
import dayjs from 'dayjs';
import React from 'react';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { lang } from 'utils/language';
dayjs.extend(weekOfYear);

const getStartOfWeek = (date: Date) => {
  const day = dayjs(date);
  return day.subtract((day.day() + 6) % 7, 'day').toDate();
};

const BookingsPage = ({
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

  return (
    <>
      <h2>{lang('Tarmenkalendern', 'The Tarmen Calendar')}</h2>
      <Calendar start={weekStart} />
    </>
  );
};

export default BookingsPage;
