'use client';

import { useState } from 'react';
import CharacterToken from './character-token';
import { CharacterId } from './characters';
import Switch from 'components/input/switch';

interface CharacterTokenSelectorProps {
  characters: CharacterId[];
  allCharacters: CharacterId[];
  onChange?: (arg0: CharacterId) => void;
  defaultShowAll?: boolean;
}

const CharacterTokenSelector = ({
  characters,
  allCharacters,
  onChange,
  defaultShowAll = false,
}: CharacterTokenSelectorProps) => {
  const [showAllCharacters, setShowAllCharacters] = useState(defaultShowAll);

  const charactersSet = new Set(characters);
  const activeCharacters = showAllCharacters
    ? allCharacters
    : allCharacters.filter((id) => charactersSet.has(id));

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap justify-center gap-4'>
        {activeCharacters.map((id) => (
          <div key={id} className='min-w-[80px]'>
            <CharacterToken characterId={id} onClick={() => onChange?.(id)} />
          </div>
        ))}
      </div>
      <Switch
        label='Show characters not in play'
        value={showAllCharacters}
        onChange={setShowAllCharacters}
      />
    </div>
  );
};

export default CharacterTokenSelector;
