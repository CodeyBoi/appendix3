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
}

interface CorpsDisplayProps {
  corps: Corps;
  nameFormat?: NameFormat;
}

const getName = (corps: Corps, nameFormat: NameFormat) => {
  if (nameFormat === 'nickname') {
    return displayName(corps);
  } else if (nameFormat === 'number-only') {
    return corps.number === null && corps.bNumber === null
      ? corps.lastName.trim()
      : '';
  } else {
    return fullName(corps);
  }
};

const CorpsDisplay = ({
  corps,
  nameFormat = 'nickname',
}: CorpsDisplayProps) => {
  const [open, setOpen] = useState(false);
  const displayName = `${displayNumber(corps)} ${getName(
    corps,
    nameFormat,
  )}`.trim();
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
      target={<div className='hover:underline'>{displayName}</div>}
    >
      <CorpsInfobox id={corps.id} open={open} />
    </Popover>
  );
};

export default CorpsDisplay;
