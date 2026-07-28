'use client';

import Button from 'components/input/button';
import { useState } from 'react';
import {
  CharacterId,
  CHARACTERS,
  getDefaultAlignment,
  getType,
} from './characters';
import CharacterTokenSelector from './character-token-selector';
import { cn } from 'utils/class-names';
import CharacterToken from './character-token';
import ActionIcon from 'components/input/action-icon';
import { IconCirclePlus2 } from '@tabler/icons-react';

interface InfoTokenProps {
  text?: string;
  className?: string;
  characters?: CharacterId[];
  allCharacters?: CharacterId[];
  initialCharacters?: CharacterId[];
  demonBluffs?: CharacterId[];
  setDemonBluffs?: (arg0: CharacterId[]) => void;
}

const InfoToken = ({
  text = '',
  className = '',
  characters = [],
  allCharacters = [],
  initialCharacters,
  demonBluffs,
  setDemonBluffs,
}: InfoTokenProps) => {
  const [isSelectingCharacterToken, setIsSelectingCharacterToken] =
    useState(false);
  const [characterTokens, _setCharacterTokens] = useState<CharacterId[]>(
    demonBluffs ?? initialCharacters ?? [],
  );

  const showAddCharacterTokenButton =
    characters.length > 0 && allCharacters.length > 0;

  const setCharacterTokens = (v: CharacterId[]) => {
    const sortedList = allCharacters.filter((characterId) =>
      v.includes(characterId),
    );
    _setCharacterTokens(sortedList);
    if (demonBluffs !== undefined && setDemonBluffs !== undefined) {
      setDemonBluffs(sortedList);
    }
  };

  const charactersSet = new Set(
    demonBluffs ? characterTokens.concat(characters) : characterTokens,
  );
  const filterFunc = (id: CharacterId) =>
    !charactersSet.has(id) &&
    (demonBluffs === undefined ||
      (getDefaultAlignment(id) === 'good' && getType(id) !== 'travellers'));

  const firstCharacterToken = characterTokens[0];
  return (
    <div
      className={cn(
        'relative flex flex-col items-center px-2 py-8 text-white lg:p-8',
        className,
      )}
    >
      {!isSelectingCharacterToken && (
        <>
          {showAddCharacterTokenButton && (
            <div className='absolute right-2 top-2'>
              <ActionIcon
                onClick={() => {
                  setIsSelectingCharacterToken(true);
                }}
              >
                <IconCirclePlus2 />
              </ActionIcon>
            </div>
          )}
          <h2 className='text-wrap scale-75 text-center lg:scale-100'>
            {text}
          </h2>
          <div className='h-2' />
          <div className='flex w-full flex-wrap justify-center gap-4 lg:w-1/2'>
            {characterTokens.length > 0 &&
              characterTokens.map((id, i) => (
                <div
                  key={text + id}
                  className={cn('w-32', characterTokens.length > 1 && 'w-24')}
                >
                  <CharacterToken
                    characterId={id}
                    onClick={() => {
                      if (
                        confirm(
                          'Do you want to remove this character info token?',
                        )
                      ) {
                        setCharacterTokens(characterTokens.toSpliced(i, 1));
                      }
                    }}
                  />
                </div>
              ))}
            {characterTokens.length === 1 &&
              firstCharacterToken &&
              CHARACTERS[firstCharacterToken].description}
          </div>
        </>
      )}
      {isSelectingCharacterToken && (
        <>
          <h2 className='scale-75 lg:scale-100'>
            Add character token
            {demonBluffs && ' (Showing good characters not in play)'}
          </h2>
          <div className='h-2' />
          <CharacterTokenSelector
            characters={characters.filter(filterFunc)}
            allCharacters={allCharacters.filter(filterFunc)}
            onChange={(id) => {
              setCharacterTokens([...characterTokens, id]);
              setIsSelectingCharacterToken(false);
            }}
            defaultShowAll={!!demonBluffs}
          />
          <div className='h-2' />
          <Button
            compact
            onClick={() => {
              setIsSelectingCharacterToken(false);
            }}
          >
            Cancel
          </Button>
        </>
      )}
    </div>
  );
};

export default InfoToken;
