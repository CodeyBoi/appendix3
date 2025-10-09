'use client';

import { useEffect, useState } from 'react';
import SetCard from './card';
import { filterNone, range, shuffle } from 'utils/array';
import useKeyDown from 'hooks/use-key-down';
import { lang } from 'utils/language';
import { api } from 'trpc/react';
import Modal from 'components/modal';
import ActionIcon from 'components/input/action-icon';
import { IconInfoCircle } from '@tabler/icons-react';
import SetRules from './rules';
import { trpc } from 'utils/trpc';
import Loading from 'components/loading';
import Button from 'components/input/button';

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

const DEFAULT_BOARD_SIZE = 12;
const DEFAULT_SET_SIZE = 3;

const DEFAULT_DECK = SHAPES.flatMap((shape) =>
  COLORS.flatMap((color) =>
    FILLS.flatMap((fill) =>
      AMOUNTS.map((amount) => ({ shape, color, fill, amount })),
    ),
  ),
);

const generateDeck = () => {
  const deck = DEFAULT_DECK.slice();
  return shuffle(deck);
};

const isValid = ([first, ...rest]: string[]) =>
  new Set([first, ...rest]).size === [first, ...rest].length ||
  rest.every((val) => val === first);

const isSet = (cards: Card[]) => {
  const first = cards[0];

  if (!first) {
    return true;
  }

  return (Object.keys(first) as Array<keyof Card>).every((key) =>
    isValid(cards.map((card) => card[key])),
  );
};

const findSets = (cards: Card[]) => {
  const sets = new Set<number[]>();
  for (let ai = 0; ai < cards.length; ai++) {
    for (let bi = ai + 1; bi < cards.length; bi++) {
      for (let ci = bi + 1; ci < cards.length; ci++) {
        if (ai === bi || bi === ci || ci === ai) {
          continue;
        }

        const a = cards[ai] as Card;
        const b = cards[bi] as Card;
        const c = cards[ci] as Card;

        if (isSet([a, b, c])) {
          sets.add([ai, bi, ci]);
        }
      }
    }
  }
  return Array.from(sets.values());
};

const redrawCards = (
  initialBoard: Card[],
  initialDeck: Card[],
  redrawIndexes: number[],
) => {
  const board: (Card | undefined)[] = initialBoard.slice();
  const deck = initialDeck.slice();

  for (const index of redrawIndexes) {
    board[index] = deck.pop();
  }

  if (findSets(filterNone(board)).length > 0) {
    return { board: filterNone(board), deck };
  }

  // Redraw a card if no set exists
  for (let deckIndex = 0; deckIndex < deck.length; deckIndex++) {
    for (const boardIndex of redrawIndexes) {
      const deckCard = deck[deckIndex];
      const boardCard = board[boardIndex];
      if (!deckCard) {
        throw new Error(
          'This should be unreachable as we check boundaries in the while condition',
        );
      } else if (!boardCard) {
        throw new Error(
          'This should be unreachable as we populate the indexes in the previous while block',
        );
      }

      // Swap the two cards
      deck[deckIndex] = boardCard;
      board[boardIndex] = deckCard;

      if (findSets(filterNone(board)).length > 0) {
        return { board: filterNone(board), deck };
      }

      // Swap the two cards back
      deck[deckIndex] = deckCard;
      board[boardIndex] = boardCard;
    }
  }

  return { board: filterNone(board), deck };
};

const strokeColors: Record<Color, string> = {
  blue: 'stroke-blue-600',
  red: 'stroke-red-600',
  yellow: 'stroke-yellow-600',
};

interface SetGameProps {
  boardSize?: number;
  setSize?: number;
}

const SetGame = ({
  boardSize = DEFAULT_BOARD_SIZE,
  setSize = DEFAULT_SET_SIZE,
}: SetGameProps) => {
  const utils = trpc.useUtils();

  const [deck, setDeck] = useState<Card[]>([]);
  const [board, setBoard] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [points, setPoints] = useState(0);
  const [usedCheats, setUsedCheats] = useState(false);
  const [sessionId, setSessionId] = useState<number | undefined>();
  const [timeTaken, setTimeTaken] = useState<number | undefined>();

  const startSession = api.games.startSetSession.useMutation({
    onSuccess: ({ id }) => {
      setSessionId(id);
    },
  });
  const endSession = api.games.endSetSession.useMutation({
    onSuccess: ({ durationInMillis }) => {
      if (durationInMillis) {
        setTimeTaken(durationInMillis);
      }
      void utils.games.getSetHighscores.invalidate();
    },
  });

  const isFinished = deck.length === 0;

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

  const shuffleBoard = () => {
    const selectedCards = selected.map((index) => board[index] as Card);
    const shuffledBoard = shuffle(board.slice());
    setSelected(selectedCards.map((card) => shuffledBoard.indexOf(card)));
    setBoard(shuffledBoard);
  };

  // Start game session when component mounted
  useEffect(() => {
    const { board: initialBoard, deck: initialDeck } = redrawCards(
      [],
      generateDeck(),
      range(boardSize),
    );
    setBoard(initialBoard);
    setDeck(initialDeck);
    startSession.mutate();
  }, []);

  useEffect(() => {
    if (selected.length !== setSize) {
      return;
    }
    const cards = filterNone(selected.map((index) => board[index]));
    if (cards.length !== setSize) {
      console.log('error when picking out cards: ' + JSON.stringify(cards));
      return;
    }

    if (isSet(cards)) {
      const { board: newBoard, deck: newDeck } = redrawCards(
        board,
        deck,
        selected,
      );

      setBoard(newBoard);
      setDeck(newDeck);
      setPoints(points + 1);
      setHighlighted([]);
    }
    setSelected([]);
  }, [selected]);

  // End game session if game has been won
  useEffect(() => {
    if (
      deck.length === 0 &&
      board.length === boardSize &&
      !usedCheats &&
      sessionId !== undefined
    ) {
      endSession.mutate({ id: sessionId });
    }
  }, [deck]);

  useKeyDown('I', () => {
    setUsedCheats(true);
    if (highlighted.length > 0) {
      setHighlighted([]);
      return;
    }
    const foundSets = findSets(board);
    const foundSet = foundSets[0];
    if (foundSet) {
      console.log(
        `Found sets: ${foundSets
          .map((set) => `{ ${set.join(', ')} }`)
          .join(', ')}`,
      );
      setHighlighted(foundSet);
    } else {
      console.log("Couldn't find set for board!");
    }
  });

  useKeyDown('O', () => {
    setUsedCheats(true);
    const foundSets = findSets(board).filter((set) =>
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
      if (cardIndex === undefined) {
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

  if (board.length === 0) {
    return <Loading msg={lang('Skapar kortlek...', 'Creating deck...')} />;
  }

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
        <div className='flex w-full justify-around gap-2'>
          <div className='flex grow'>
            <h3 className='pl-4'>
              {points}/{(DEFAULT_DECK.length - boardSize) / setSize}{' '}
              {lang('poäng', 'points')}
            </h3>
          </div>
          <Modal
            title={lang('Regler för Set', 'Rules for Set')}
            withCloseButton
            target={
              <ActionIcon>
                <IconInfoCircle />
              </ActionIcon>
            }
          >
            <div className='p-4'>
              <SetRules />
            </div>
          </Modal>
        </div>
        <div className='grid max-w-max grid-cols-3 gap-2'>
          {board.map((card, i) => (
            <div
              key={JSON.stringify(card)}
              className='hover:cursor-pointer'
              onClick={() => {
                handleClick(i);
              }}
            >
              <SetCard
                selected={selected.includes(i)}
                highlighted={highlighted.includes(i)}
                {...card}
              />
            </div>
          ))}
        </div>
        <div className='flex justify-around gap-2'>
          <Button onClick={shuffleBoard}>{lang('Blanda', 'Shuffle')}</Button>
          <Button
            onClick={() => {
              setSelected([]);
            }}
          >
            {lang('Rensa val', 'Clear selected')}
          </Button>
        </div>
        <h3 className='text-center'>
          {isFinished && timeTaken && (
            <>
              {lang(
                'Du tog dig igenom hela leken på ',
                'You got through the whole deck in ',
              )}
              <span>
                {Math.floor(timeTaken / 60 / 1000)}:
                {String(Math.floor(timeTaken / 1000) % 60).padStart(2, '0')}
                <span className='text-xs font-thin text-gray-500'>
                  .{String(timeTaken % 1000).padStart(3, '0')}
                </span>
              </span>
              !
            </>
          )}
          {isFinished && usedCheats && lang('Fuskis.', 'Cheater.')}
        </h3>
      </div>
    </>
  );
};

export default SetGame;
