import { IconX } from '@tabler/icons-react';
import CorpsDisplay from 'components/corps/display';
import Checkbox from 'components/input/checkbox';

type Corps = {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  number: number | null;
};

interface SignupEntryProps {
  corps: Corps;
  attended: boolean;
  checkbox1?: boolean;
  checkbox2?: boolean;
  isAdmin?: boolean;
  setAttendance: (attended: boolean) => void;
  handleDelete: () => void;
}

const Entry = ({
  corps,
  attended,
  checkbox1,
  checkbox2,
  isAdmin = false,
  setAttendance,
  handleDelete,
}: SignupEntryProps) => {
  return (
    <>
      <td>
        <CorpsDisplay corps={corps} />
      </td>
      {isAdmin && (
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
              onChange={(event) => setAttendance(event.target.checked)}
            />
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
