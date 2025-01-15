'use client';

import Popover from 'components/popover';
import CorpsInfobox from './infobox';
import { useState } from 'react';

type NameFormat = 'nickname' | 'number-only' | 'full-name';

interface Corps {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  number: number | null;
}

interface CorpsDisplayProps {
  corps: Corps;
  nameFormat?: NameFormat;
}

const getName = (corps: Corps, nameFormat: NameFormat) => {
  if (nameFormat === 'nickname') {
    return corps.nickName
      ? corps.nickName.trim()
      : `${corps.firstName.trim()} ${corps.lastName.trim()}`;
  } else if (nameFormat === 'number-only') {
    return corps.number === null ? corps.lastName.trim() : '';
  } else {
    return `${corps.firstName.trim()} ${corps.lastName.trim()}`;
  }
};

const CorpsDisplay = ({
  corps,
  nameFormat = 'nickname',
}: CorpsDisplayProps) => {
  const [open, setOpen] = useState(false);
  const numberStr = corps.number ? `#${corps.number}` : 'p.e.';
  const displayName = `${numberStr} ${getName(corps, nameFormat)}`.trim();
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
