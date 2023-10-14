import { Checkbox } from '@mantine/core';
import { IconX } from '@tabler/icons';
import React from 'react';

interface SignupEntryProps {
  signup: {
    corpsId: string;
    instrument: string;
    number?: number;
    firstName: string;
    lastName: string;
    attended: boolean;
    checkbox1: boolean;
    checkbox2: boolean;
  };
  isAdmin?: boolean;
  setAttendance: (attended: boolean) => void;
  handleDelete: () => void;
}

const Entry = ({
  signup,
  isAdmin = false,
  setAttendance,
  handleDelete,
}: SignupEntryProps) => {
  const name = `${signup.number ? '#' + signup.number.toString() : 'p.e.'} ${
    signup.firstName
  } ${signup.lastName}`;

  return (
    <>
      <td>{signup.instrument}</td>
      <td>{name}</td>
      {isAdmin && (
        <>
          <td>
            <div className='flex place-content-center'>
              <Checkbox
                styles={{ root: { display: 'flex' } }}
                defaultChecked={signup.attended}
                onChange={(event) => setAttendance(event.target.checked)}
              />
            </div>
          </td>
          <td className='flex place-content-center'>
            <button
              type='button'
              className='text-red-600'
              onClick={handleDelete}
            >
              <IconX />
            </button>
          </td>
        </>
      )}
    </>
  );
};

export default Entry;
