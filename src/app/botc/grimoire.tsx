import CharacterToken from './character-token';
import { BOTCPlayer } from './characters';

interface GrimoireProps {
  players: BOTCPlayer[];
  setPlayers: (newPlayers: BOTCPlayer[]) => void;
}

const Grimoire = ({ players, setPlayers }: GrimoireProps) => {
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
        />
      ))}
    </div>
  );
};

export default Grimoire;
