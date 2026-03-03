import { range, zip } from 'utils/array';
import { BotcPlayer } from './blood-on-the-clocktower-game';
import CharacterToken from './character-token';
import ReminderToken from './reminder-token';
import React from 'react';

interface GrimoireProps {
  players: BotcPlayer[];
  setCurrentPlayerIndex: (index: number) => void;
}

const getOvalPoints = (n: number) =>
  range(n).map((i) => {
    const t = (2.0 * i * Math.PI) / n - Math.PI / 2.0;
    return { left: 0.5 + 0.4 * Math.cos(t), top: 0.5 + 0.42 * Math.sin(t) };
  });

const toPercent = (v: number) => `${Math.floor(v * 100)}%`;

const Grimoire = ({ players, setCurrentPlayerIndex }: GrimoireProps) => {
  const points = getOvalPoints(players.length);
  return (
    <div className='relative h-[85vh] w-full lg:h-[900px] '>
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
                dead={!player.isAlive}
                onClick={() => {
                  setCurrentPlayerIndex(i);
                }}
              />
            </div>
            {player.reminders
              .concat(player.automaticReminders)
              .map((reminder, i) => (
                <div
                  className='absolute -translate-x-1/2 -translate-y-1/2'
                  key={key + reminder.characterId + reminder.message}
                  style={{
                    left: toPercent(
                      (point.left - 0.5) * (1 - (i + 1.6) / 5.5) + 0.5,
                    ),
                    top: toPercent(
                      (point.top - 0.5) * (1 - (i + 1.6) / 5.5) + 0.5,
                    ),
                    zIndex: -(i + 1),
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
