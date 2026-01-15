import { range, zip } from 'utils/array';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import CharacterToken from './character-token';
import { Edition, getAllCharacters } from './characters';
import ReminderToken from './reminder-token';
import React from 'react';

interface GrimoireProps {
  edition: Edition;
  players: BotcPlayer[];
  setPlayers: (newPlayers: BotcPlayer[]) => void;
}

const getOvalPoints = (n: number) =>
  range(n).map((i) => {
    const t = (2.0 * i * Math.PI) / n - Math.PI / 2.0;
    return { left: 0.5 + 0.4 * Math.cos(t), top: 0.5 + 0.35 * Math.sin(t) };
  });

const toPercent = (v: number) => `${Math.floor(v * 100)}%`;

const Grimoire = ({ edition, players, setPlayers }: GrimoireProps) => {
  const allCharacters = getAllCharacters(edition);
  const points = getOvalPoints(players.length);
  return (
    <div className='relative w-full' style={{ height: '500px' }}>
      {zip(players, points).map(([player, point], i) => {
        const key = (player.name ?? '') + player.characterId;
        return (
          <React.Fragment key={key}>
            <div
              className='absolute'
              style={{
                left: toPercent(point.left),
                top: toPercent(point.top),
              }}
            >
              <CharacterToken
                playerName={player.name}
                characterId={player.characterId}
                players={players}
                playerIndex={i}
                setPlayers={setPlayers}
                dead={!player.isAlive}
                allCharacters={allCharacters}
              />
            </div>
            {player.reminders
              .concat(player.automaticReminders)
              .map((reminder, i) => (
                <div
                  className='absolute'
                  key={key + reminder.characterId + reminder.message}
                  style={{
                    left: toPercent(point.left * (1 - (i + 1) / 5)),
                    top: toPercent(point.top * (1 - (i + 1) / 5)),
                  }}
                >
                  <ReminderToken
                    characterId={reminder.characterId}
                    text={reminder.message}
                  />
                </div>
              ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Grimoire;
