type CalendarItem = {
  title: string;
  start: Date;
  end: Date;
};

type CalendarProps = {
  items: CalendarItem[];
  week: number;
  year: number;
};

const Calendar = ({ items, week, year }: CalendarProps) => {
  return <div>kalender</div>;
};

export default Calendar;
