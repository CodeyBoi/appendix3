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

interface InfoTokenProps {
  text?: string;
  className?: string;
  characters: CharacterId[];
  allCharacters: CharacterId[];
  demonBluffs?: CharacterId[];
  setDemonBluffs?: (arg0: CharacterId[]) => void;
}

const InfoToken = ({
  text = '',
  className = '',
  characters,
  allCharacters,
  demonBluffs,
  setDemonBluffs,
}: InfoTokenProps) => {
  const [isSelectingCharacterToken, setIsSelectingCharacterToken] =
    useState(false);
  const [characterTokens, _setCharacterTokens] = useState<CharacterId[]>(
    demonBluffs ?? [],
  );

  const setCharacterTokens = (v: CharacterId[]) => {
    _setCharacterTokens(v);
    if (demonBluffs !== undefined && setDemonBluffs !== undefined) {
      setDemonBluffs(v);
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
        'flex flex-col items-center rounded border p-12 text-white shadow-md',
        className,
      )}
    >
      {!isSelectingCharacterToken && (
        <>
          <h3 className='text-wrap text-center'>{text}</h3>
          <div className='h-4' />
          <div className='flex w-1/2 flex-wrap justify-center gap-4'>
            {characterTokens.length > 0 &&
              characterTokens.map((id, i) => (
                <div key={text + id} className='w-1/3'>
                  <CharacterToken
                    characterId={id}
                    onClick={() => {
                      setCharacterTokens(characterTokens.toSpliced(i, 1));
                    }}
                  />
                </div>
              ))}
            {characterTokens.length === 1 &&
              firstCharacterToken &&
              CHARACTERS[firstCharacterToken].description}
          </div>
          <div className='h-4' />
          <div className='flex gap-2'>
            <Button
              compact
              onClick={() => {
                setIsSelectingCharacterToken(true);
              }}
            >
              Add character token
            </Button>
          </div>
        </>
      )}
      {isSelectingCharacterToken && (
        <>
          <h3>
            Add character token
            {demonBluffs && ' (Showing good characters not in play)'}
          </h3>
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
