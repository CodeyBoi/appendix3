'use client';

import { Card, cardToString } from 'utils/card';
import {
  canAttackWithWeapon,
  getMonsterStrength,
  Room,
  Weapon,
} from './scoundrel';
import { cn } from 'utils/class-names';
import ActionIcon from 'components/input/action-icon';
import { IconSword } from '@tabler/icons-react';

interface RoomElementProps {
  room: Room;
  equippedWeapon?: Weapon;
  onClick: (card: Card, i: number, useWeapon: boolean) => void;
  onMouseEnter: (card: Card, useWeapon: boolean) => void;
  onMouseLeave: () => void;
}

const RoomElement = ({
  room,
  equippedWeapon,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: RoomElementProps) => {
  return (
    <div className='flex select-none gap-2'>
      {room.map((card, i) => {
        if (!card) {
          return (
            <p
              key={`empty-${i}`}
              className='mt-2 h-auto w-min text-8xl text-transparent'
            >
              {cardToString({ rank: 1, suit: 'spade' })}
            </p>
          );
        }
        return (
          <div className='flex flex-col items-center gap-2'>
            <p
              key={`${card.rank}-${card.suit}`}
              className={cn(
                'mt-2 h-auto w-min text-8xl hover:cursor-pointer',
                ['heart', 'diamond'].includes(card.suit) && 'text-red-600',
              )}
              onClick={() => {
                onClick(card, i, false);
              }}
              onMouseEnter={() => {
                onMouseEnter(card, false);
              }}
              onMouseLeave={onMouseLeave}
            >
              {cardToString(card)}
            </p>
            {['spade', 'club'].includes(card.suit) &&
            canAttackWithWeapon(
              equippedWeapon,
              getMonsterStrength(card.rank),
            ) ? (
              <ActionIcon
                className='w-min'
                onClick={() => {
                  onClick(card, i, true);
                }}
                onMouseEnter={() => {
                  onMouseEnter(card, true);
                }}
                onMouseLeave={onMouseLeave}
              >
                <IconSword size={42} />
              </ActionIcon>
            ) : (
              <ActionIcon
                tabIndex={-1}
                className='pointer-events-none bg-transparent text-transparent'
              >
                <IconSword size={42} />
              </ActionIcon>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RoomElement;
