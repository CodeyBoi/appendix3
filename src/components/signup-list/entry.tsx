import { Checkbox } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface SignupEntryProps {
  name: string;
  number: number | null;
  attended: boolean;
  checkbox1?: boolean;
  checkbox2?: boolean;
  isAdmin?: boolean;
  setAttendance: (attended: boolean) => void;
  handleDelete: () => void;
}

const Entry = ({
  name,
  number,
  attended,
  checkbox1,
  checkbox2,
  isAdmin = false,
  setAttendance,
  handleDelete,
}: SignupEntryProps) => {
  const corpsNumber = number ? '#' + number.toString() : 'p.e.';
  return (
    <>
      <td className='pr-1 text-right w-max'>{corpsNumber}</td>
      <td>{name}</td>
      {isAdmin && (
        <>
          {checkbox1 !== undefined && (
            <td className='px-2 text-center'>{checkbox1 ? 'Ja' : 'Nej'}</td>
          )}
          {checkbox2 !== undefined && (
            <td className='px-2 text-center'>{checkbox2 ? 'Ja' : 'Nej'}</td>
          )}
          <td className='px-2'>
            <div className='flex place-content-center'>
              <Checkbox
                styles={{ root: { display: 'flex' } }}
                defaultChecked={attended}
                onChange={(event) => setAttendance(event.target.checked)}
              />
            </div>
          </td>
          <td className='flex px-2 place-content-center'>
            <button
              className='text-red-600'
              type='button'
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
