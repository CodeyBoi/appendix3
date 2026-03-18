'use client';

import Button from 'components/input/button';
import { CharacterId } from './characters';
import { useState } from 'react';
import Modal from 'components/modal';
import InfoToken from './info-token';

interface InfoTokenListProps {
  chosenCharacters: CharacterId[];
  allCharacters: CharacterId[];
}

const INFO_TOKENS = [
  {
    text: 'This is the Demon',
    className: 'bg-red-600',
  },
  {
    text: 'These are your Minions',
    className: 'bg-red-600',
  },
  {
    text: 'These characters are not in play',
    className: 'bg-blue-500',
  },
  {
    text: 'This character selected you',
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
}: InfoTokenListProps) => {
  const [activeTokenIndex, setActiveTokenIndex] = useState<
    number | undefined
  >();
  const [modalOpen, setModalOpen] = useState(false);
  const token =
    activeTokenIndex !== undefined ? INFO_TOKENS[activeTokenIndex] : undefined;
  console.log({ chosenCharacters, allCharacters });
  return (
    <>
      <Modal
        open={modalOpen}
        onBlur={() => {
          setModalOpen(false);
        }}
        withCloseButton
        hideBackground
      >
        {token && <InfoToken text={token.text} />}
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
