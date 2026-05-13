'use client';

import Button from 'components/input/button';
import { CharacterId } from './characters';
import { useState } from 'react';
import Modal, { ModalBackgroundColor } from 'components/modal';
import InfoToken from './info-token';

interface InfoTokenListProps {
  chosenCharacters: CharacterId[];
  allCharacters: CharacterId[];
  demonBluffs: CharacterId[];
  setDemonBluffs: (arg0: CharacterId[]) => void;
}

const INFO_TOKENS: { text: string; color: ModalBackgroundColor }[] = [
  {
    text: 'This is the Demon',
    color: 'red',
  },
  {
    text: 'These are your Minions',
    color: 'red',
  },
  {
    text: 'These are your Demon bluffs',
    color: 'blue',
  },
  {
    text: 'This character selected you',
    color: 'blue',
  },
  {
    text: 'These characters are NOT in play',
    color: 'blue',
  },
  {
    text: 'These characters are in play',
    color: 'blue',
  },
  {
    text: 'You are',
    color: 'green',
  },
  {
    text: 'This person is',
    color: 'green',
  },
  {
    text: 'Use your ability?',
    color: 'green',
  },
  {
    text: 'Are you sure?',
    color: 'green',
  },
];

const BUTTON_BG: Record<ModalBackgroundColor, string> = {
  red: 'bg-red-600',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  white: 'bg-red-600',
};

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
  const infoToken =
    activeTokenIndex !== undefined ? INFO_TOKENS[activeTokenIndex] : undefined;
  return (
    <>
      <Modal
        title='Info token'
        open={modalOpen}
        bgColor={infoToken?.color}
        onBlur={() => {
          setModalOpen(false);
          setActiveTokenIndex(undefined);
        }}
        hideBackground
        withCloseButton
        stayOpenOnBackgroundClicked
      >
        {INFO_TOKENS.map((token, i) => (
          <div
            key={'inModal:' + token.text}
            className={i === activeTokenIndex ? '' : 'hidden'}
          >
            <InfoToken
              text={token.text}
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
      <div className='grid grid-cols-1 gap-2 text-xs lg:grid-cols-2'>
        {INFO_TOKENS.map((token, i) => (
          <Button
            key={token.text}
            className={BUTTON_BG[token.color]}
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
