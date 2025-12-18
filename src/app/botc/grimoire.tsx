import CharacterToken from './character-token';
import { BOTCPlayer, CharacterID } from './characters';

interface GrimoireProps {
  players: BOTCPlayer[];
  characters: CharacterID[];
}

const playerNames = [
  'Hannes',
  'Hannes2',
  'Bartolomeus',
  'Kyoto',
  'Jörgen',
  'Pratkvarn',
  'Pelle',
  'Lars',
];

const Grimoire = ({ characters }: GrimoireProps) => {
  const fakePlayers = characters.map((characterId, i) => ({
    characterId,
    name: i < playerNames.length ? (playerNames[i] as string) : undefined,
  }));
  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-5'>
      {fakePlayers.map((player) => (
        <CharacterToken
          key={(player.name ?? '') + player.characterId}
          playerName={player.name}
          characterId={player.characterId}
        />
      ))}
    </div>
  );
};

export default Grimoire;
