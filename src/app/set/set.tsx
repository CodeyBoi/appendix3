'use client';

import { useEffect, useState } from 'react';
import SetCard from './card';
import { filterNone, shuffle } from 'utils/array';
import useKeyDown from 'hooks/use-key-down';
import { lang } from 'utils/language';
import Timer from 'components/timer';
import { cn } from 'utils/class-names';

const SHAPES = ['wave', 'oval', 'diamond'] as const;
export type Shape = (typeof SHAPES)[number];
const COLORS = ['red', 'blue', 'yellow'] as const;
export type Color = (typeof COLORS)[number];
const FILLS = ['solid', 'striped', 'clear'] as const;
export type Fill = (typeof FILLS)[number];
const AMOUNTS = ['one', 'two', 'three'] as const;
export type Amount = (typeof AMOUNTS)[number];

export interface Card {
  amount: Amount;
  shape: Shape;
  color: Color;
  fill: Fill;
}

interface SetGameProps {
  initialCards?: Card[];
}

const NO_OF_CARDS = 12;

const generateDeck = () => {
  const deck: Card[] = [];
  for (const shape of SHAPES) {
    for (const color of COLORS) {
      for (const fill of FILLS) {
        for (const amount of AMOUNTS) {
          deck.push({ shape, color, fill, amount });
        }
      }
    }
  }
  return shuffle(deck);
};

const isValid = (a: string, b: string, c: string) =>
  (a !== b && b !== c && c !== a) || (a === b && b === c);
const isSet = (a: Card, b: Card, c: Card) =>
  (Object.keys(a) as Array<keyof Card>).every((key) =>
    isValid(a[key], b[key], c[key]),
  );

const findSets = (cards: Card[]) => {
  const sets = [];
  for (let ai = 0; ai < cards.length; ai++) {
    for (let bi = 0; bi < cards.length; bi++) {
      for (let ci = 0; ci < cards.length; ci++) {
        if (ai === bi || bi === ci || ci === ai) {
          continue;
        }

        const a = cards[ai] as Card;
        const b = cards[bi] as Card;
        const c = cards[ci] as Card;

        if (isSet(a, b, c)) {
          sets.push([ai, bi, ci]);
        }
      }
    }
  }
  return sets;
};

const strokeColors: Record<Color, string> = {
  blue: 'stroke-blue-600',
  red: 'stroke-red-600',
  yellow: 'stroke-yellow-600',
};

const SetGame = ({ initialCards = [] }: SetGameProps) => {
  const [deck, setDeck] = useState(generateDeck());
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [points, setPoints] = useState(0);

  const drawCards = (amount: number) => {
    const newDeck = deck.slice();
    const newCards = cards.slice();

    for (let i = 0; i < amount; i++) {
      const card = newDeck.pop();
      if (card) {
        newCards.push(card);
      }
    }

    setDeck(newDeck);
    setCards(newCards);
  };

  const handleClick = (index: number) => {
    const newSelected = selected.slice();
    const foundIndex = newSelected.findIndex((v) => v === index);
    if (foundIndex !== -1) {
      newSelected.splice(foundIndex, 1);
    } else {
      newSelected.push(index);
    }
    setSelected(newSelected);
  };

  // Initial game actions
  useEffect(() => {
    if (cards.length < NO_OF_CARDS) {
      drawCards(NO_OF_CARDS - cards.length);
    }
  }, []);

  useEffect(() => {
    if (selected.length !== 3) {
      return;
    }
    const [a, b, c] = selected.map((index) => cards[index]);
    if (!a || !b || !c) {
      console.log(
        'error when picking out cards: ' + JSON.stringify({ a, b, c }),
      );
      return;
    }

    if (isSet(a, b, c)) {
      console.log('Found set! ' + JSON.stringify({ a, b, c }));
      const newDeck = deck.slice();
      const newCards: (Card | undefined)[] = cards.slice();

      // TODO: Only draw cards up to max
      for (const index of selected) {
        newCards[index] = newDeck.pop();
      }

      // Redraw a card if no set exists
      while (newDeck.length > 0 && !findSets(filterNone(newCards))[0]) {
        const firstSelected = selected[0];
        if (!firstSelected) {
          // This should not be possible, as `selected` should have length 3
          break;
        }
        const randomIndex = Math.floor(Math.random() * newDeck.length);
        const temp = newDeck[randomIndex];
        newDeck[randomIndex] = newCards[firstSelected] as Card;
        newCards[firstSelected] = temp;
      }

      setDeck(newDeck);
      setCards(filterNone(newCards));
      console.log(
        `Sets found: ${points + 1}\nCards in deck: ${newDeck.length}`,
      );
      setPoints(points + 1);
    } else {
      console.log('This is NOT a set! ' + JSON.stringify({ a, b, c }));
    }
    setSelected([]);
  }, [selected]);

  useKeyDown('I', () => {
    const foundSets = findSets(cards);
    const foundSet = foundSets[0];
    if (foundSet) {
      console.log(
        `Found sets: ${foundSets
          .map((set) => `{ ${set.join(', ')} }`)
          .join(', ')}`,
      );
      setSelected(foundSet);
    } else {
      console.log("Couldn't find set for board!");
    }
  });

  useKeyDown('O', () => {
    const foundSets = findSets(cards).filter((set) =>
      selected.every((cardIndex) => set.includes(cardIndex)),
    );
    const foundSet = foundSets[0];
    if (foundSet) {
      console.log(
        `Found sets: ${foundSets
          .map((set) => `{ ${set.join(', ')} }`)
          .join(', ')}`,
      );
      console.log(`Using set: { ${foundSet.join(', ')} }`);
      const cardIndex = foundSet.find((ci) => !selected.includes(ci));
      if (!cardIndex) {
        console.log('Something went wrong when adding new card to selected!');
        return;
      }
      setSelected([...selected, cardIndex]);
    } else {
      console.log(
        `Couldn't find set containing { ${selected.join(', ')} } for board!`,
      );
    }
  });

  const isFinished = cards.length < 12;

  return (
    <>
      <svg width={0} height={0}>
        <defs>
          {COLORS.map((color) => (
            <pattern
              key={`set-stripes-${color}`}
              className={strokeColors[color]}
              id={`set-stripes-${color}`}
              width={9}
              height={9}
              patternUnits='userSpaceOnUse'
            >
              <line x1='0' y1='0' x2='9' y2='0' strokeWidth={2.5} />
            </pattern>
          ))}
        </defs>
      </svg>
      <div className='flex max-w-xl flex-col items-center gap-2'>
        <div
          className={cn(
            'flex w-full justify-around',
            isFinished && 'flex-col items-center',
          )}
        >
          <h3>
            {points} {lang('poäng', 'points')}
          </h3>
          <h3>
            {isFinished &&
              lang(
                'Du tog dig igenom hela leken på ',
                'You got through the whole deck in ',
              )}
            <Timer stopped={cards.length < NO_OF_CARDS} />
            {isFinished && '!'}
          </h3>
        </div>
        <div className='grid max-w-max grid-cols-3 gap-2'>
          {cards.map((card, i) => (
            <div
              key={JSON.stringify(card)}
              className='hover:cursor-pointer'
              onClick={() => {
                handleClick(i);
              }}
            >
              <SetCard selected={selected.includes(i)} {...card} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SetGame;
