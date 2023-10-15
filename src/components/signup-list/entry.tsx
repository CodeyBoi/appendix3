import { Checkbox } from '@mantine/core';
import { IconX } from '@tabler/icons';

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
      <td>{name}</td>
      {isAdmin && (
        <>
          <td className='px-2'>
            <div className='flex place-content-center'>
              <Checkbox
                styles={{ root: { display: 'flex' } }}
                defaultChecked={signup.attended}
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
