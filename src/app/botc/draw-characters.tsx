import { useState } from 'react';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import { CharacterId, getDefaultAlignment } from './characters';
import InfoToken from './info-token';
import Button from 'components/input/button';
import TextInput from 'components/input/text-input';
import { cn } from 'utils/class-names';

interface DrawCharactersProps {
  characters: CharacterId[];
  startGame: (players: BotcPlayer[]) => void;
}

const DrawCharacters = ({ characters, startGame }: DrawCharactersProps) => {
  const [characterIndex, setCharacterIndex] = useState<number | null>(null);
  const [players, setPlayers] = useState<BotcPlayer[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [pickedNumbers, setPickedNumbers] = useState<Set<number>>(new Set());
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
            setCharacterIndex(i);
            setPickedNumbers(new Set(pickedNumbers).add(i));
          }}
          className={cn(
            'flex h-20 w-20 flex-col justify-center rounded-full bg-red-600 p-8 text-center text-4xl font-bold text-white lg:h-24 lg:w-24 lg:text-5xl',
            pickedNumbers.has(i) ? 'opacity-25' : 'hover:cursor-pointer',
          )}
        >
          {(i + 1).toString()}
        </div>
      ))}
    </div>
  ) : (
    <div className='flex flex-col'>
      <InfoToken
        className={
          getDefaultAlignment(characterId) === 'good'
            ? 'bg-blue-500'
            : 'bg-red-600'
        }
        initialCharacters={[characterId]}
      />
      <form
        onSubmit={() => {
          const newPlayers = players.slice();
          newPlayers.push(
            new BotcPlayer({
              name: playerName,
              characterId,
              index: newPlayers.length,
            }),
          );
          setPlayerName('');
          setCharacterIndex(null);
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
