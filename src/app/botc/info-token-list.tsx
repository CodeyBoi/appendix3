'use client';

import Button from 'components/input/button';
import { CharacterId } from './characters';
import { useState } from 'react';
import Modal from 'components/modal';
import InfoToken from './info-token';

interface InfoTokenListProps {
  chosenCharacters: CharacterId[];
  allCharacters: CharacterId[];
  demonBluffs: CharacterId[];
  setDemonBluffs: (arg0: CharacterId[]) => void;
}

const INFO_TOKENS = [
  {
    text: 'This is the Demon',
    className: 'bg-red-700',
  },
  {
    text: 'These are your Minions',
    className: 'bg-red-700',
  },
  {
    text: 'These are your Demon bluffs',
    className: 'bg-blue-500',
  },
  {
    text: 'This character selected you',
    className: 'bg-blue-500',
  },
  {
    text: 'These characters are NOT in play',
    className: 'bg-blue-500',
  },
  {
    text: 'These characters are in play',
    className: 'bg-blue-500',
  },
  {
    text: 'You are',
    className: 'bg-green-500',
  },
  {
    text: 'Use your ability?',
    className: 'bg-green-500',
  },
];

const InfoTokenList = ({
  chosenCharacters,
  allCharacters,
  demonBluffs,
  setDemonBluffs,
}: InfoTokenListProps) => {
  const [activeTokenIndex, setActiveTokenIndex] = useState<
    number | undefined
  >();
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Modal
        title='Info token'
        open={modalOpen}
        onBlur={() => {
          setModalOpen(false);
          setActiveTokenIndex(undefined);
        }}
        withCloseButton
        hideBackground
      >
        {INFO_TOKENS.map((token, i) => (
          <div
            key={'inModal:' + token.text}
            className={i === activeTokenIndex ? '' : 'hidden'}
          >
            <InfoToken
              text={token.text}
              className={token.className}
              characters={chosenCharacters}
              allCharacters={allCharacters}
              demonBluffs={
                token.text.includes('bluffs') ? demonBluffs : undefined
              }
              setDemonBluffs={
                token.text.includes('bluffs') ? setDemonBluffs : undefined
              }
            />
          </div>
        ))}
      </Modal>
      <div className='grid grid-cols-2 gap-2 text-xs'>
        {INFO_TOKENS.map((token, i) => (
          <Button
            key={token.text}
            className={token.className}
            fullWidth
            onClick={() => {
              setActiveTokenIndex(i);
              setModalOpen(true);
            }}
          >
            {token.text}
          </Button>
        ))}
      </div>
    </>
  );
};

export default InfoTokenList;
