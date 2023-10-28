import Popover from 'components/popover';
import CorpsInfobox from './infobox';

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
  const { id, firstName, lastName, nickName, number } = corps;
  const displayName = nickName
    ? nickName.trim()
    : `${firstName.trim()} ${lastName.trim()}`;
  return (
    <Popover
      position='top-right'
      target={
        <div className='flex text-sm'>
          <div className={'w-8' + (!number ? ' text-right' : '')}>{`${
            number ? `#${number}` : 'p.e.'
          }`}</div>
          <div className='w-1.5' />
          <div className='hover:underline'>{displayName}</div>
        </div>
      }
      popover={<CorpsInfobox id={id} />}
    />
  );
};

export default CorpsDisplay;
