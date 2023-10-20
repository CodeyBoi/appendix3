'use client';

import { Menu } from '@mantine/core';
import { Gig } from '@prisma/client';
import {
  IconApple,
  IconCalendarPlus,
  IconDotsVertical,
  IconEdit,
  IconUsers,
} from '@tabler/icons';
import dayjs from 'dayjs';
import Link from 'next/link';

type GigMenuProps = {
  gig: Gig & { type: { name: string } };
  isAdmin: boolean;
};

const GigMenu = ({ gig, isAdmin }: GigMenuProps) => {
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
    <Menu shadow='md' width={200} position='left-start' withArrow>
      <Menu.Target>
        <button className='p-1 text-red-600 rounded hover:bg-red-600/10'>
          <IconDotsVertical />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          icon={<IconUsers />}
          component={Link}
          href={`/gig/${gig.id}`}
        >
          Se anmälningar
        </Menu.Item>
        <Menu.Item icon={<IconCalendarPlus />} disabled={calenderLink === ''}>
          <a href={calenderLink} target='_blank' rel='noopener noreferrer'>
            Lägg till i kalender
          </a>
        </Menu.Item>
        {isAdmin && (
          <>
            <Menu.Divider />
            <Menu.Label>Admin</Menu.Label>
            <Menu.Item
              icon={<IconEdit />}
              component={Link}
              href={`/admin/gig/${gig.id}`}
            >
              Redigera
            </Menu.Item>
            <Menu.Item
              icon={<IconApple />}
              component={Link}
              href={`/admin/gig/${gig.id}/info`}
            >
              Matpreffar
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default GigMenu;
