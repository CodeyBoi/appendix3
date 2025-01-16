import { IconX } from '@tabler/icons-react';
import CorpsDisplay from 'components/corps/display';
import Checkbox from 'components/input/checkbox';

interface Corps {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  number: number | null;
}

interface SignupEntryProps {
  corps: Corps;
  attended: boolean;
  checkbox1?: boolean;
  checkbox2?: boolean;
  showAdminTools?: boolean;
  setAttendance: (attended: boolean) => void;
  handleDelete: () => void;
}

const Entry = ({
  corps,
  attended,
  checkbox1,
  checkbox2,
  showAdminTools = false,
  setAttendance,
  handleDelete,
}: SignupEntryProps) => {
  return (
    <>
      <td>
        <CorpsDisplay corps={corps} />
      </td>
      {showAdminTools && (
        <>
          {checkbox1 !== undefined && (
            <td className='px-2 text-center'>{checkbox1 ? 'Ja' : 'Nej'}</td>
          )}
          {checkbox2 !== undefined && (
            <td className='px-2 text-center'>{checkbox2 ? 'Ja' : 'Nej'}</td>
          )}
          <td className='px-2'>
            <Checkbox
              defaultChecked={attended}
              onChange={(event) => {
                setAttendance(event.target.checked);
              }}
            />
          </td>
          <td className='flex place-content-center px-2'>
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
