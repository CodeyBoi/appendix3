'use client';

import Popover from 'components/popover';
import CorpsInfobox from './infobox';
import { useState } from 'react';
import { displayName, displayNumber, fullName } from 'utils/corps';

type NameFormat = 'nickname' | 'number-only' | 'full-name';

interface Corps {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  number: number | null;
  bNumber: number | null;
  corpsBirthday?: Date;
}

interface CorpsDisplayProps {
  corps: Corps;
  nameFormat?: NameFormat;
  currentDate?: Date;
}

const getName = (corps: Corps, nameFormat: NameFormat) => {
  if (nameFormat === 'nickname') {
    return displayName(corps);
  } else if (nameFormat === 'number-only') {
    return corps.number === null && corps.bNumber === null
      ? 'p.e. ' + corps.lastName.trim()
      : displayNumber(corps);
  } else {
    return fullName(corps);
  }
};

const CorpsDisplay = ({
  corps,
  nameFormat = 'nickname',
  currentDate = new Date(),
}: CorpsDisplayProps) => {
  const [open, setOpen] = useState(false);
  const isBirthday =
    corps.corpsBirthday &&
    corps.corpsBirthday.getDate() === currentDate.getDate() &&
    corps.corpsBirthday.getMonth() === currentDate.getMonth();
  return (
    <Popover
      position='bottom-right'
      onFocus={() => {
        setOpen(true);
      }}
      onBlur={() => {
        setOpen(false);
      }}
      targetClassName='max-w-max'
      target={
        <div className='hover:underline'>
          {getName(corps, nameFormat).trim() + (isBirthday ? ' 🎂' : '')}
        </div>
      }
    >
      <CorpsInfobox id={corps.id} open={open} />
    </Popover>
  );
};

export default CorpsDisplay;
