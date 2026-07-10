import { useEffect, useState } from 'react';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import { CharacterId, getDefaultAlignment } from './characters';
import InfoToken from './info-token';
import Button from 'components/input/button';
import TextInput from 'components/input/text-input';
import { cn } from 'utils/class-names';
import { ModalBackgroundColor } from 'components/modal';

interface DrawCharactersProps {
  characters: CharacterId[];
  startGame: (players: BotcPlayer[]) => void;
  setModalBgColor: (color: ModalBackgroundColor) => void;
  fixedCharacterOrder?: boolean;
}

const DrawCharacters = ({
  characters,
  startGame,
  setModalBgColor,
  fixedCharacterOrder = false,
}: DrawCharactersProps) => {
  const [characterIndex, setCharacterIndex] = useState<number | null>(null);
  const [players, setPlayers] = useState<BotcPlayer[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [pickedNumbers, setPickedNumbers] = useState<Set<number>>(new Set());

  useEffect(() => {
    setPlayers([]);
    setPickedNumbers(new Set());
    console.log(characters);
  }, [characters]);

  const characterId =
    characterIndex !== null && characters[characterIndex] !== undefined
      ? characters[characterIndex]
      : null;
  return characterIndex === null || characterId === null ? (
    <div className='flex flex-wrap gap-4'>
      {characters.map((cid, i) => (
        <div
          key={`${cid}-${i + 1}`}
          onClick={() => {
            if (pickedNumbers.has(i)) {
              return;
            }
            const selectedIndex = fixedCharacterOrder ? players.length : i;
            const selectedCharacterId = characters[selectedIndex];
            setCharacterIndex(selectedIndex);
            setPickedNumbers(new Set(pickedNumbers).add(i));
            setModalBgColor(
              selectedCharacterId &&
                getDefaultAlignment(selectedCharacterId) === 'good'
                ? 'blue'
                : 'red',
            );
          }}
          className={cn(
            'flex h-20 w-20 flex-col justify-center rounded-full bg-white p-8 text-center text-4xl font-bold text-red-600 lg:h-24 lg:w-24 lg:text-5xl',
            pickedNumbers.has(i) ? 'opacity-50' : 'hover:cursor-pointer',
          )}
        >
          {(i + 1).toString()}
        </div>
      ))}
    </div>
  ) : (
    <div className='flex flex-col'>
      <InfoToken initialCharacters={[characterId]} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newPlayers = players.slice();
          newPlayers.push(
            new BotcPlayer({
              name: playerName,
              characterId,
              id: newPlayers.length,
            }),
          );
          setPlayerName('');
          setCharacterIndex(null);
          setModalBgColor('red');
          if (pickedNumbers.size >= characters.length) {
            startGame(newPlayers);
          } else {
            setPlayers(newPlayers);
          }
        }}
        className={cn('flex items-center justify-center gap-2 rounded p-2')}
      >
        <TextInput
          onChange={setPlayerName}
          value={playerName}
          label='Player name'
          autoFocus
        />
        <Button type='submit'>Done</Button>
      </form>
    </div>
  );
};

export default DrawCharacters;
