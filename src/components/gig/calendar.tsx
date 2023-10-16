import { Indicator } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { Gig } from '@prisma/client';
import dayjs from 'dayjs';
import React from 'react';

const GigCalendar = ({ gigs }: { gigs?: Gig[] }) => {
  const [date, setDate] = React.useState<Date | null>();
  const gigDates = gigs?.map((gig) => dayjs(gig.date));

  return (
    <Calendar
      value={date}
      onChange={setDate}
      locale='sv'
      renderDay={(date) => {
        const isGig =
          gigDates?.find((gigDate) =>
            gigDate.isSame(dayjs(date.toLocaleDateString(), 'day')),
          ) ?? false;
        return (
          <Indicator disabled={!isGig} offset={8} size={5}>
            <div>{date.getDate()}</div>
          </Indicator>
        );
      }}
    />
  );
};

export default GigCalendar;
