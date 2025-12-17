'use client';

import Switch from 'components/input/switch';
import { initObject, range, shuffle } from 'utils/array';
import { cn } from 'utils/class-names';
import {
  CHARACTER_TYPES,
  CharacterID,
  CHARACTERS,
  CharacterType,
  Edition,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from './characters';
import BOTCCharacterPanel from './character-panel';
import { useState } from 'react';
import Button from 'components/input/button';
import React from 'react';

const getNumberOfCharacters = (
  players: number,
  selectedCharacters: CharacterID[] = [],
): Record<CharacterType, number> => {
  const clampedPlayers = Math.min(players, MAX_PLAYERS);
  const res =
    players < 7
      ? {
          townsfolk: 3,
          outsiders: players === 5 ? 0 : 1,
          minions: 1,
          demons: 1,
          travellers: 0,
        }
      : {
          townsfolk: 5 + Math.floor((clampedPlayers - 7) / 3) * 2,
          outsiders: (clampedPlayers - 7) % 3,
          minions: 1 + Math.floor((clampedPlayers - 7) / 3),
          demons: 1,
          travellers: Math.max(players - MAX_PLAYERS, 0),
        };
  for (const [characterType, diff] of Object.entries(
    findSelectionError(selectedCharacters, res),
  )) {
    res[characterType as CharacterType] =
      res[characterType as CharacterType] + diff;
  }
  return res;
};

const generateCharacterRow = (
  character: CharacterType,
  selectedColumn: number,
) => {
  const color = ['townsfolk', 'outsiders'].includes(character)
    ? 'text-blue-500'
    : 'text-red-600';
  return (
    <tr className={color} key={character + 'amount'}>
      <td
        className={cn(
          'border-x first-letter:capitalize',
          character === 'demons' && 'border-b',
        )}
      >
        {character}
      </td>
      {range(MIN_PLAYERS, MAX_PLAYERS + 1).map((n) => (
        <td
          className={cn(
            'border-x',
            n === selectedColumn && 'bg-red-600/20',
            character === 'demons' && 'border-b',
          )}
          key={character + n.toString()}
        >
          {getNumberOfCharacters(n)[character]}
        </td>
      ))}
    </tr>
  );
};

const selectRandom = (
  edition: Edition,
  numberOfCharacters: Record<CharacterType, number>,
) => {
  const selected: CharacterID[] = [];
  for (const characterType of CHARACTER_TYPES) {
    const copy = shuffle(edition[characterType].slice());
    selected.push(...copy.slice(0, numberOfCharacters[characterType]));
  }

  // Correct if characters which change character amounts are picked
  for (const [type, diff] of Object.entries(
    findSelectionError(selected, numberOfCharacters),
  )) {
    if (diff === 0) {
      continue;
    }
    const characters = edition[type as CharacterType];
    for (let i = 0; i < Math.abs(diff); i++) {
      // Remove character belonging to character class
      if (diff < 0) {
        const idx = selected.findIndex((id) => characters.includes(id));
        if (idx !== -1) {
          selected.splice(idx, 1);
        }
      }

      // Add character from character class
      else {
        const newCharacter = shuffle(characters.slice()).find(
          (id) => !selected.includes(id),
        );
        if (newCharacter) {
          selected.push(newCharacter);
        }
      }
    }
  }

  return selected;
};

const findSelectionError = (
  characters: CharacterID[],
  numberOfCharacters: Record<CharacterType, number>,
) => {
  const res: Record<CharacterType, number> = initObject(CHARACTER_TYPES, 0);
  const addOutsiders = (n: number) => {
    res['outsiders'] = res['outsiders'] + n;
    res['townsfolk'] = res['townsfolk'] - n;
  };
  for (const c of characters) {
    switch (c) {
      case 'baron':
        addOutsiders(2);
        break;

      case 'godfather':
        // Add 1 outsider if number of outsiders is less than 2, otherwise remove 1
        addOutsiders(numberOfCharacters['outsiders'] < 2 ? 1 : -1);
        break;

      case 'fanggu':
        addOutsiders(1);
        break;

      case 'vigormortis':
        addOutsiders(-1);
        break;
    }
  }
  return res;
};

interface BOTCCharacterSelectProps {
  numberOfPlayers: number;
  onNumberOfPlayersChange: (numberOfPlayers: number) => void;
  edition: Edition;
  onSelectedCharactersChange: (selectedCharacters: CharacterID[]) => void;
}

const BOTCCharacterSelect = ({
  numberOfPlayers,
  onNumberOfPlayersChange,
  edition,
  onSelectedCharactersChange,
}: BOTCCharacterSelectProps) => {
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [selectedCharacters, _setSelectedCharacters] = useState<CharacterID[]>(
    [],
  );
  const setSelectedCharacters = (c: CharacterID[]) => {
    onSelectedCharactersChange(c);
    _setSelectedCharacters(c);
  };

  const numberOfCharacters = getNumberOfCharacters(
    numberOfPlayers,
    selectedCharacters,
  );
  const numberOfSelectedCharacters = selectedCharacters.reduce(
    (acc, selectedCharacterId) => {
      for (const characterType of CHARACTER_TYPES) {
        if (edition[characterType].includes(selectedCharacterId)) {
          acc[characterType] = acc[characterType] + 1;
          break;
        }
      }
      return acc;
    },
    initObject(CHARACTER_TYPES, 0),
  );

  return (
    <div className='flex flex-col gap-2'>
      <table className='w-min text-center'>
        <tbody>
          <tr className='font-bold'>
            <td className='border-x border-t'>Players</td>
            {range(MIN_PLAYERS, MAX_PLAYERS).map((n) => (
              <td
                className={cn(
                  'border-x border-t px-2',
                  n === numberOfPlayers && 'bg-red-600/20',
                )}
                key={n}
              >
                {n}
              </td>
            ))}
            <td
              className={cn(
                'border-x border-t px-2',
                15 === numberOfPlayers && 'bg-red-600/20',
              )}
            >
              {MAX_PLAYERS}+
            </td>
          </tr>

          {CHARACTER_TYPES.slice(0, -1).map((t) =>
            generateCharacterRow(t, numberOfPlayers),
          )}
        </tbody>
      </table>
      <label htmlFor='players'>Number of players: {numberOfPlayers}</label>
      <input
        type='range'
        id='players'
        name='players'
        min={MIN_PLAYERS}
        max={MAX_PLAYERS}
        defaultValue={numberOfPlayers}
        onChange={(e) => {
          onNumberOfPlayersChange(e.currentTarget.valueAsNumber);
        }}
      />
      <Switch
        label='Show character abilities'
        value={showDescriptions}
        onChange={() => {
          setShowDescriptions(!showDescriptions);
        }}
      />
      <Switch label='Allow duplicate characters' />
      <div className='flex gap-2'>
        <Button
          onClick={() => {
            setSelectedCharacters(
              selectRandom(edition, getNumberOfCharacters(numberOfPlayers)),
            );
          }}
        >
          Select random
        </Button>
        <Button
          onClick={() => {
            setSelectedCharacters([]);
          }}
        >
          Clear selection
        </Button>
      </div>
      {CHARACTER_TYPES.map((characterType) => {
        return (
          <React.Fragment key={edition.id + characterType}>
            <div className='flex flex-col rounded border-2 border-red-600'>
              <div className='flex w-full justify-between gap-4 bg-red-600 px-2 text-white'>
                <h3 className='first-letter:capitalize'>{characterType}</h3>
                <h3>{`${numberOfSelectedCharacters[characterType]} / ${numberOfCharacters[characterType]}`}</h3>
              </div>
              <div className='grid grid-cols-3 lg:grid-cols-5'>
                {edition[characterType]
                  .map((id) => CHARACTERS[id])
                  .map(({ id, name, description }) => (
                    <div
                      key={id}
                      className={cn(
                        'border border-red-600/30 px-2 py-1',
                        selectedCharacters.includes(id) && 'bg-red-600/20',
                      )}
                      onClick={() => {
                        const newSelected = selectedCharacters.slice();
                        const idx = newSelected.findIndex((c) => c === id);
                        if (idx !== -1) {
                          newSelected.splice(idx, 1);
                        } else {
                          newSelected.push(id);
                        }
                        setSelectedCharacters(newSelected);
                      }}
                    >
                      <BOTCCharacterPanel
                        name={name}
                        description={description}
                        showDescription={showDescriptions}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className='h-2' />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BOTCCharacterSelect;
