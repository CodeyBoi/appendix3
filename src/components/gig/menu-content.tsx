import { Gig } from '@prisma/client';
import {
  IconUsers,
  IconCalendarPlus,
  IconEdit,
  IconApple,
} from '@tabler/icons-react';
import Button from 'components/input/button';
import Divider from 'components/divider';
import dayjs from 'dayjs';
import Link from 'next/link';

type GigMenuContentProps = {
  gig: Gig & { type: { name: string } };
  isAdmin: boolean;
};

const GigMenuContent = ({ gig, isAdmin }: GigMenuContentProps) => {
  const getCalendarLink = (startTime: string, endTime: string) => {
    const dateStr = dayjs(gig.date).format('YYYYMMDD');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      gig.title,
    )}&dates=${dateStr}T${startTime}00/${dateStr}T${endTime}00&details=${encodeURIComponent(
      gig.description,
    )}&location=${encodeURIComponent(gig.location)}`;
  };

  const generateCalendarLink = () => {
    if (!(gig.meetup.includes(':') || gig.meetup.includes('.'))) return '';
    const [meetupHour, meetupMinute] = gig.meetup.split(/[:.]/);
    if (!meetupHour || !meetupMinute) return '';

    const hasEndTime =
      !!gig.end && (gig.end.includes(':') || gig.end.includes('.'));
    const hasStartTime =
      !!gig.start && (gig.start.includes(':') || gig.start.includes('.'));

    if (hasEndTime) {
      const [endHour, endMinute] = gig.end.split(/[:.]/);
      if (!endHour || !endMinute) return '';
      return getCalendarLink(
        `${meetupHour}${meetupMinute}`,
        `${endHour}${endMinute}`,
      );
    } else if (hasStartTime) {
      const [startHour, startMinute] = gig.start.split(/[:.]/);
      if (!startHour || !startMinute) return '';
      const isHourEleven = hasStartTime ? parseInt(startHour) === 23 : false;
      const [endHour, endMinute] = isHourEleven
        ? ['23', '59']
        : [(parseInt(startHour) + 1).toString(), startMinute];
      return getCalendarLink(
        `${meetupHour}${meetupMinute}`,
        `${endHour}${endMinute}`,
      );
    }
    return '';
  };

  const calenderLink = generateCalendarLink();

  return (
    <>
      <Link href={`/gig/${gig.id}`}>
        <Button
          className='flex justify-start w-full hover:bg-red-600/10'
          color='transparent'
        >
          <IconUsers />
          Se anmälningar
        </Button>
      </Link>
      <a href={calenderLink} target='_blank' rel='noopener noreferrer'>
        <Button
          className='flex justify-start w-full hover:bg-red-600/10'
          color='transparent'
          disabled={calenderLink === ''}
        >
          <IconCalendarPlus />
          Lägg till i kalender
        </Button>
      </a>
      {isAdmin && (
        <>
          <div className='-mx-1'>
            <Divider />
          </div>
          <div className='px-3 py-1 text-xs text-gray-500'>Admin</div>
          <Link href={`/admin/gig/${gig.id}`}>
            <Button
              className='flex justify-start w-full hover:bg-red-600/10'
              color='transparent'
            >
              <IconEdit />
              Redigera
            </Button>
          </Link>
          <Link href={`/admin/gig/${gig.id}/info`}>
            <Button
              className='flex justify-start w-full hover:bg-red-600/10'
              color='transparent'
            >
              <IconApple />
              Matpreferenser
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

export default GigMenuContent;
