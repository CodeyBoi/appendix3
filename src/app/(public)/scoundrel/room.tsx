import { Card, cardToString } from 'utils/card';
import { Room } from './scoundrel';
import { cn } from 'utils/class-names';

interface RoomElementProps {
  room: Room;
  onClick: (card: Card, i: number) => void;
  onMouseEnter: (card: Card) => void;
  onMouseLeave: () => void;
}

const RoomElement = ({
  room,
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
          <p
            key={`${card.rank}-${card.suit}`}
            className={cn(
              'mt-2 h-auto w-min text-8xl hover:cursor-pointer',
              ['heart', 'diamond'].includes(card.suit) && 'text-red-600',
            )}
            onClick={() => {
              onClick(card, i);
            }}
            onMouseEnter={() => {
              onMouseEnter(card);
            }}
            onMouseLeave={onMouseLeave}
          >
            {cardToString(card)}
          </p>
        );
      })}
    </div>
  );
};

export default RoomElement;
