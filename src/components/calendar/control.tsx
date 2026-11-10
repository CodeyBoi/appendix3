'use client';

import {
  IconPlus,
  IconPencil,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import Button from 'components/input/button';
import ParamsSelect from 'components/input/params-select';
import { useSearchParamsState } from 'hooks/use-search-params-state';
import { cn } from 'utils/class-names';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import Restricted from 'components/restricted/client';
import Modal from 'components/modal';
import BookingForm from 'app/(authenticated)/bookings/form';
import { lang } from 'utils/language';
dayjs.extend(weekOfYear);

const startYear = 2026;
const endYear = new Date().getFullYear() + 2;
const years = Array.from({ length: endYear - startYear }, (_, i) => ({
  label: (startYear + i).toString(),
  value: (startYear + i).toString(),
}));

const weeks = Array.from({ length: 52 }, (_, i) => ({
  label: (i + 1).toString(),
  value: (i + 1).toString(),
}));

const CalendarControl = () => {
  const [week, setWeek] = useSearchParamsState(
    'week',
    dayjs().week().toString(),
  );
  const [year, setYear] = useSearchParamsState(
    'year',
    dayjs().year().toString(),
  );

  return (
    <div className='flex items-center justify-between gap-2 p-2'>
      <div className='flex gap-2'>
        <Modal
          title={lang('Ny bokning', 'New booking')}
          target={
            <Button>
              <IconPlus />
              {lang('Skapa bokningsförfrågan', 'Create booking request')}
            </Button>
          }
        >
          <BookingForm />
        </Modal>
        <Restricted permissions={'manageBookings'}>
          <Button href='/admin/bookings'>
            <IconPencil />
            Godkänn bokningar
          </Button>
        </Restricted>
      </div>
      <div className='flex gap-2'>
        <ActionIcon
          className={cn(
            week === '1' &&
              year === startYear.toString() &&
              'pointer-events-none opacity-50',
          )}
          variant='subtle'
          onClick={() => {
            if (+week === 1) {
              setYear((+year - 1).toString());
            }
            setWeek(((+week + 51) % 52).toString());
          }}
        >
          <IconChevronLeft />
        </ActionIcon>
        <ParamsSelect
          label='Vecka'
          paramName='week'
          options={weeks}
          defaultValue={week.toString()}
        />
        <ParamsSelect
          label='År'
          paramName='year'
          options={years}
          defaultValue={year.toString()}
        />
        <ActionIcon
          variant='subtle'
          onClick={() => {
            if (week === '52') {
              setYear((+year + 1).toString());
            }
            setWeek(((+week + 1) % 52).toString());
          }}
        >
          <IconChevronRight />
        </ActionIcon>
      </div>
    </div>
  );
};

export default CalendarControl;
