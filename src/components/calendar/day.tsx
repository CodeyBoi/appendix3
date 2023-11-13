import { CalendarItem } from '.';

type CalendarDayProps = {
  date: Date;
  items: CalendarItem[];
};

const CalendarDay = ({ date, items }: CalendarDayProps) => {
  date.setHours(0, 0, 0, 0);
  const sorted = items
    .filter(
      (item) =>
        item.start.getTime() >= date.getTime() &&
        item.start.getTime() <= date.getTime() + 86400000,
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  return (
    <div className='flex flex-col overflow-y-auto px-1'>
      {sorted.map((item) => {
        const { title, start, end } = item;
        return (
          <div
            key={title + start.toISOString()}
            className='rounded bg-red-200 px-1 leading-tight'
          >
            <span className='text-xs'>
              {title}
              <br />
              <span className='font-light text-gray-500'>
                {start.toLocaleTimeString('sv-SE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {'-'}
                {end.toLocaleTimeString('sv-SE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarDay;
