import { Menu } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { Gig } from '@prisma/client';
import {
  IconDotsVertical,
  IconUsers,
  IconCalendarPlus,
  IconEdit,
  IconInfoCircle,
} from '@tabler/icons';
import dayjs from 'dayjs';
import React from 'react';

type GigMenuProps = {
  gig: Gig & { type: { name: string } };
  isAdmin: boolean;
  setOpened: (opened: boolean) => void;
};

const GigMenu = ({ gig, isAdmin, setOpened }: GigMenuProps) => {
  const hasValidTimes = gig.meetup.includes(':') || gig.meetup.includes('.');

  const getCalendarLink = (startTime: string, endTime: string) => {
    const dateStr = dayjs(gig.date).format('YYYYMMDD');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      gig.title,
    )}&dates=${dateStr}T${startTime}00/${dateStr}T${endTime}00&details=${encodeURIComponent(
      gig.description,
    )}&location=${encodeURIComponent(gig.location)}`;
  };

  const generateCalendarLink = () => {
    if (!hasValidTimes) return '';
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

  return (
    <Menu shadow='md' width={200} position='left-start' withArrow>
      <Menu.Target>
        <button className='p-1 text-red-600 rounded hover:bg-red-100'>
          <IconDotsVertical />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          icon={<IconUsers />}
          component={NextLink}
          href={`/gig/${gig.id}`}
        >
          Se anmälningar
        </Menu.Item>
        <Menu.Item icon={<IconCalendarPlus />} disabled={!hasValidTimes}>
          <a
            href={generateCalendarLink()}
            target='_blank'
            rel='noopener noreferrer'
          >
            Lägg till i kalender
          </a>
        </Menu.Item>
        {isAdmin && (
          <>
            <Menu.Divider />
            <Menu.Label>Admin</Menu.Label>
            <Menu.Item icon={<IconEdit />} onClick={() => setOpened(true)}>
              Redigera
            </Menu.Item>
            <Menu.Item
              icon={<IconInfoCircle />}
              component='a'
              href={`/admin/gig/${gig.id}/info`}
            >
              Anmälningsinfo
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default GigMenu;
