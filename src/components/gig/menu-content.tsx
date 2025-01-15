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
import { lang } from 'utils/language';
import Restricted from 'components/restricted/server';

interface GigMenuContentProps {
  gig: Gig & { type: { name: string } };
}

const GigMenuContent = ({ gig }: GigMenuContentProps) => {
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
      const isHourEleven = parseInt(startHour) === 23;
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
    <div className='flex flex-col'>
      <Button
        href={`/gig/${gig.id}`}
        fullWidth
        className='flex justify-start hover:bg-red-600/10'
        color='transparent'
      >
        <IconUsers />
        {lang('Se anmälningar', 'View signups')}
      </Button>
      <a href={calenderLink} target='_blank' rel='noopener noreferrer'>
        <Button
          className='flex justify-start hover:bg-red-600/10'
          color='transparent'
          disabled={calenderLink === ''}
        >
          <IconCalendarPlus />
          {lang('Lägg till i kalender', 'Add to calendar')}
        </Button>
      </a>
      <Restricted permissions={['manageGigs', 'viewFoodPrefs']}>
        <div className='-mx-1'>
          <Divider />
        </div>
        <div className='px-3 py-1 text-xs text-gray-500'>Admin</div>
      </Restricted>
      <Restricted permissions='manageGigs'>
        <Button
          fullWidth
          href={`/admin/gig/${gig.id}`}
          className='flex justify-start hover:bg-red-600/10'
          color='transparent'
        >
          <IconEdit />
          {lang('Redigera', 'Edit')}
        </Button>
      </Restricted>
      <Restricted permissions='viewFoodPrefs'>
        <Button
          fullWidth
          href={`/admin/gig/${gig.id}/info`}
          className='flex justify-start hover:bg-red-600/10'
          color='transparent'
        >
          <IconApple />
          {lang('Matpreferenser', 'Food preferences')}
        </Button>
      </Restricted>
    </div>
  );
};

export default GigMenuContent;
