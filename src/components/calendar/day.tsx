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
    <div className='flex h-32 flex-col overflow-y-auto pl-1'>
      <div className='text-red-600'>{date.getDate()}</div>
      {sorted.map((item) => {
        const { title, start, end } = item;
        return (
          <div
            key={title + start.toISOString()}
            className='bg-white leading-tight'
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
