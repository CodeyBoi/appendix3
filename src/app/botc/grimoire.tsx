import CharacterToken from './character-token';
import { BOTCPlayer, Edition, getAllCharacters } from './characters';

interface GrimoireProps {
  edition: Edition;
  players: BOTCPlayer[];
  setPlayers: (newPlayers: BOTCPlayer[]) => void;
}

const Grimoire = ({ edition, players, setPlayers }: GrimoireProps) => {
  const allCharacters = getAllCharacters(edition);
  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-5'>
      {players.map((player, i) => (
        <CharacterToken
          key={(player.name ?? '') + player.characterId}
          playerName={player.name}
          characterId={player.characterId}
          players={players}
          playerIndex={i}
          setPlayers={setPlayers}
          dead={!player.isAlive}
          allCharacters={allCharacters}
        />
      ))}
    </div>
  );
};

export default Grimoire;
