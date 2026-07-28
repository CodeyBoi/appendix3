'use client';

import Switch from 'components/input/switch';
import { chooseRandom, initObject, range, shuffle } from 'utils/array';
import { cn } from 'utils/class-names';
import {
  CHARACTER_TYPES,
  CharacterId,
  CHARACTERS,
  CharacterType,
  Edition,
  isEvil,
  isGood,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from './characters';
import BotcCharacterPanel from './character-panel';
import { useEffect, useState } from 'react';
import Button from 'components/input/button';
import React from 'react';

interface BotcCharacterSelectProps {
  edition: Edition;
  selectedCharacters: CharacterId[];
  onSelectedCharactersChange: (selectedCharacters: CharacterId[]) => void;
}

const getNumberOfCharacters = (
  players: number,
  selectedCharacters: CharacterId[] = [],
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

const CharacterCountTableRow = ({
  character,
  selectedColumn,
  onClick,
}: {
  character: CharacterType;
  selectedColumn?: number;
  onClick?: (n: number) => void;
}) => {
  const pointerOnHover = onClick !== undefined;
  const color = isGood(character) ? 'text-blue-500' : 'text-red-600';
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
          key={character + n.toString()}
          className={cn(
            'border-x',
            n === selectedColumn && 'bg-red-600/20',
            character === 'demons' && 'border-b',
            pointerOnHover && 'hover:cursor-pointer',
          )}
          onClick={() => {
            onClick?.(n);
          }}
        >
          {getNumberOfCharacters(n)[character]}
        </td>
      ))}
    </tr>
  );
};

interface CharacterCountTableProps {
  numberOfPlayers?: number;
  onChange?: (n: number) => void;
}

export const CharacterCountTable = ({
  numberOfPlayers,
  onChange,
}: CharacterCountTableProps) => {
  const pointerOnHover = onChange !== undefined;
  return (
    <table className='w-min text-center text-xs lg:text-lg'>
      <tbody>
        <tr className='font-bold'>
          <td className='border-x border-t'>Players</td>
          {range(MIN_PLAYERS, MAX_PLAYERS).map((n) => (
            <td
              className={cn(
                'border-x border-t px-1 lg:px-2',
                n === numberOfPlayers && 'bg-red-600/20',
                pointerOnHover && 'hover:cursor-pointer',
              )}
              key={`CharacterCountHeader-${n}`}
              onClick={() => {
                onChange?.(n);
              }}
            >
              {n}
            </td>
          ))}
          <td
            className={cn(
              'border-x border-t px-1',
              15 === numberOfPlayers && 'bg-red-600/20',
              pointerOnHover && 'hover:cursor-pointer',
            )}
            onClick={() => {
              onChange?.(15);
            }}
          >
            {MAX_PLAYERS}+
          </td>
        </tr>

        {CHARACTER_TYPES.slice(0, -1).map((t) => (
          <CharacterCountTableRow
            key={`CharacterCountTable-${t}`}
            character={t}
            selectedColumn={numberOfPlayers}
            onClick={onChange}
          />
        ))}
      </tbody>
    </table>
  );
};

const selectRandom = (
  edition: Edition,
  numberOfCharacters: Record<CharacterType, number>,
) => {
  const isCharacterType = (
    typeOrId: CharacterType | CharacterId,
  ): typeOrId is CharacterType =>
    (CHARACTER_TYPES as readonly string[]).includes(typeOrId);

  const selected: CharacterId[] = [];
  for (const characterType of CHARACTER_TYPES) {
    const copy = shuffle(edition[characterType].slice());
    selected.push(...copy.slice(0, numberOfCharacters[characterType]));
  }

  // Correct errors if characters which change character amounts are picked
  const selectionError = Object.entries(
    findSelectionError(selected, numberOfCharacters),
  );
  for (const [typeOrIdArg, diff] of selectionError) {
    const typeOrId = typeOrIdArg as CharacterType | CharacterId;
    if (diff === 0) {
      continue;
    }
    if (isCharacterType(typeOrId)) {
      const characters = edition[typeOrId];
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
    } else {
      // TODO: Handle diffs in character ids
      // const _characterId = typeOrId as CharacterId;
    }
  }

  const selectedSet = new Set(selected);
  // Change characters which don't know who they are (e.g. Drunk) to a "disguise"
  const result = selected.map((characterId) => {
    const character = CHARACTERS[characterId];
    if (character.cannotBeSelected) {
      const validDisguises =
        character.disguisedAs?.flatMap((characterType) =>
          edition[characterType].filter(
            (characterId) =>
              !selectedSet.has(characterId) &&
              !CHARACTERS[characterId].cannotBeSelected,
          ),
        ) ?? [];
      const disguise = chooseRandom(validDisguises);
      if (!disguise) {
        throw new Error(`Couldn't find a valid disguise for ${characterId}`);
      }
      selectedSet.add(disguise);
      return disguise;
    } else {
      return characterId;
    }
  });

  return shuffle(result);
};

const findSelectionError = (
  characters: CharacterId[],
  numberOfCharacters: Record<CharacterType, number>,
) => {
  const res: Record<CharacterType, number> &
    Partial<Record<CharacterId, number>> = initObject(CHARACTER_TYPES, 0);
  const addOutsiders = (n: number) => {
    // Don't modify if number of outsiders would go below 0
    if (res['outsiders'] + numberOfCharacters['outsiders'] + n < 0) {
      return;
    }
    res['outsiders'] = res['outsiders'] + n;
    res['townsfolk'] = res['townsfolk'] - n;
  };
  for (const character of characters) {
    switch (character) {
      case 'baron':
        addOutsiders(2);
        break;

      case 'godfather':
        // Remove 1 outsider if number of outsiders is 2 and Fang Gu is in the game, otherwise add 1
        addOutsiders(
          numberOfCharacters['outsiders'] == 2 && characters.includes('fanggu')
            ? -1
            : 1,
        );
        break;

      case 'fanggu':
        addOutsiders(1);
        break;

      case 'vigormortis':
        addOutsiders(-1);
        break;
      case 'legionary':
        res['legionary'] = Math.floor(Math.random() * 3);
        break;
      case 'scholar':
        addOutsiders(1);
        break;
      case 'haruspex':
        if (!characters.includes('spartacus')) {
          res['spartacus'] = 1;
        }
        break;
      case 'hannibal':
        res['hannibal'] =
          2 -
          characters.reduce(
            (acc, ch) => (ch === 'hannibal' ? acc + 1 : acc),
            0,
          );
        break;
      case 'mercenary':
        res['mercenary'] =
          2 -
          characters.reduce(
            (acc, ch) => (ch === 'mercenary' ? acc + 1 : acc),
            0,
          );
        break;
    }
  }
  return res;
};

const NUMBER_OF_PLAYERS_KEY = 'botcNumberOfPlayers';

const BotcCharacterSelect = ({
  edition,
  selectedCharacters,
  onSelectedCharactersChange,
}: BotcCharacterSelectProps) => {
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [numberOfPlayers, setNumberOfPlayers] = useState(() =>
    parseInt(localStorage.getItem(NUMBER_OF_PLAYERS_KEY) ?? '7'),
  );
  const [allowDuplicateCharacters, _setAllowDuplicateCharacters] =
    useState(false);
  const setAllowDuplicateCharacters = (allow: boolean) => {
    if (!allow) {
      onSelectedCharactersChange(Array.from(new Set(selectedCharacters)));
    }
    _setAllowDuplicateCharacters(allow);
  };
  const [_disguises, _setDisguises] = useState<
    { characterId: CharacterId; disguisedAs: CharacterId }[]
  >([]);

  useEffect(() => {
    localStorage.setItem(NUMBER_OF_PLAYERS_KEY, numberOfPlayers.toString());
  }, [numberOfPlayers]);

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
      <CharacterCountTable
        numberOfPlayers={numberOfPlayers}
        onChange={setNumberOfPlayers}
      />
      <div className='flex flex-col gap-2 md:flex-row'>
        <Switch
          label='Show character abilities'
          value={showDescriptions}
          onChange={setShowDescriptions}
        />
        <Switch
          label='Allow duplicate characters'
          value={allowDuplicateCharacters}
          onChange={setAllowDuplicateCharacters}
        />
      </div>
      <div className='flex gap-2'>
        <Button
          onClick={() => {
            onSelectedCharactersChange(
              selectRandom(edition, getNumberOfCharacters(numberOfPlayers)),
            );
          }}
        >
          Select random
        </Button>
        <Button
          onClick={() => {
            onSelectedCharactersChange([]);
          }}
        >
          Clear selection
        </Button>
      </div>
      {CHARACTER_TYPES.map((characterType) => {
        const border = isGood(characterType)
          ? 'border-blue-500'
          : isEvil(characterType)
          ? 'border-red-600'
          : 'border-neutral-500';
        const subtleBorder = isGood(characterType)
          ? 'border-blue-500/30'
          : isEvil(characterType)
          ? 'border-red-600/30'
          : 'border-neutral-500/30';
        const bg = isGood(characterType)
          ? 'bg-blue-500'
          : isEvil(characterType)
          ? 'bg-red-600'
          : 'bg-neutral-500';
        const bgShade = isGood(characterType)
          ? 'bg-blue-500/20'
          : isEvil(characterType)
          ? 'bg-red-600/20'
          : 'bg-neutral-500/20';
        if (edition[characterType].length === 0) {
          return null;
        }
        return (
          <React.Fragment key={edition.id + characterType}>
            <div className={cn('flex flex-col rounded border-2', border)}>
              <div
                className={cn(
                  'flex w-full justify-between gap-4 px-2 text-white',
                  bg,
                )}
              >
                <h3 className='first-letter:capitalize'>{characterType}</h3>
                <h3>{`${numberOfSelectedCharacters[characterType]} / ${numberOfCharacters[characterType]}`}</h3>
              </div>
              <div className='grid grid-cols-2 lg:grid-cols-4'>
                {edition[characterType]
                  .map((id) => CHARACTERS[id])
                  .map(
                    ({
                      id,
                      name,
                      description,
                      image,
                      cannotBeSelected = false,
                    }) => (
                      <div
                        key={id}
                        className={cn(
                          'border px-2 py-1',
                          !allowDuplicateCharacters &&
                            !cannotBeSelected &&
                            'hover:cursor-pointer',
                          subtleBorder,
                          selectedCharacters.includes(id) && bgShade,
                          cannotBeSelected && 'opacity-50 grayscale',
                        )}
                        onClick={() => {
                          if (allowDuplicateCharacters || cannotBeSelected) {
                            return;
                          }
                          const newSelected = selectedCharacters.slice();
                          const idx = newSelected.findIndex((c) => c === id);
                          if (idx !== -1) {
                            newSelected.splice(idx, 1);
                          } else {
                            newSelected.push(id);
                          }
                          onSelectedCharactersChange(newSelected);
                        }}
                      >
                        <BotcCharacterPanel
                          name={name}
                          imgSrc={image?.[0] ?? ''}
                          description={description}
                          showDescription={showDescriptions}
                        />
                        {allowDuplicateCharacters && !cannotBeSelected && (
                          <input
                            className='w-full border'
                            type='number'
                            min={0}
                            defaultValue={
                              selectedCharacters.filter((c) => c === id).length
                            }
                            onChange={(e) => {
                              // Filter out all entries of the id and add back the desired amount
                              const val = e.currentTarget.valueAsNumber;
                              const newSelectedCharacters =
                                selectedCharacters.filter(
                                  (characterId) => characterId !== id,
                                );
                              for (let i = 0; i < val; i++) {
                                newSelectedCharacters.push(id);
                              }
                              onSelectedCharactersChange(newSelectedCharacters);
                            }}
                          />
                        )}
                      </div>
                    ),
                  )}
              </div>
            </div>
            <div className='h-2' />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BotcCharacterSelect;
