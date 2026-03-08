import { CharacterId } from './characters';

interface InfoTokenListProps {
  chosenCharacters: CharacterId[];
  allCharacters: CharacterId[];
}

const InfoTokenList = ({
  chosenCharacters,
  allCharacters,
}: InfoTokenListProps) => {
  return (
    <div className='text-wrap grid grid-cols-2 lg:grid-cols-3'>
      PLACE INFO TOKENS HERE
      {` chosenCharacters: [${chosenCharacters.join(', ')}]\n\n`}
      {`allCharacters: [${allCharacters.join(', ')}]`}
    </div>
  );
};

export default InfoTokenList;
