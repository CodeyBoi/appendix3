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
        <div className='hover:underline'>{`${
          number ? `#${number}` : 'p.e.'
        } ${displayName}`}</div>
      }
      popover={<CorpsInfobox id={id} />}
    />
  );
};

export default CorpsDisplay;
