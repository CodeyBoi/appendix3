'use client';

import Popover from 'components/popover';
import CorpsInfobox from './infobox';
import { useState } from 'react';

type Corps = {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  number: number | null;
};

type CorpsDisplayProps = {
  corps: Corps;
};

const CorpsDisplay = ({ corps }: CorpsDisplayProps) => {
  const [open, setOpen] = useState(false);
  const { id, firstName, lastName, nickName, number } = corps;
  const displayName = nickName
    ? nickName.trim()
    : `${firstName.trim()} ${lastName.trim()}`;
  return (
    <Popover
      position='top-right'
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      target={
        <div className='hover:underline'>{`${
          number ? `#${number}` : 'p.e.'
        } ${displayName}`}</div>
      }
      popover={<CorpsInfobox id={id} open={open} />}
    />
  );
};

export default CorpsDisplay;
