'use client';

import {
  IconCards,
  IconChevronRight,
  IconCoin,
  IconRefresh,
  IconRosetteDiscountCheck,
  IconSparkles,
} from '@tabler/icons-react';
import Button from 'components/input/button';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { shuffle } from 'utils/array';

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'] as const;
const RANKS: Rank[] = [
  'A',
  'K',
  'Q',
  'J',
  '10',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
] as const;
type Suit = (typeof SUITS)[number]
type Rank = (typeof RANKS)[number]

interface Card {
  id: string;
  rank: Rank;
  suit: Suit;
}

interface RoundStats {
  wins: number;
  losses: number;
  pushes: number;
  blackjacks: number;
}

type Phase = 'betting' | 'player-turn' | 'dealer-turn' | 'round-over';

const BET_OPTIONS = [10, 25, 50, 100];
const INITIAL_BANKROLL = 500;
const INITIAL_BET = 25;

const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

const SUIT_COLORS: Record<Suit, string> = {
  spades: 'text-slate-900',
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-slate-900',
};

const buildDeck = (): Card[] => {
  const deck = SUITS.flatMap((suit) => RANKS.map((rank) => ({
  id: `${rank}-${suit}`,
        rank,
        suit,
}))) 
  return shuffle(deck);
};

const cardValue = (rank: Rank) => {
  if (rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return Number(rank);
};

const getHandValue = (hand: Card[]) => {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    total += cardValue(card.rank);
    if (card.rank === 'A') aces += 1;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
};

const isSoftHand = (hand: Card[]) => {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    total += cardValue(card.rank);
    if (card.rank === 'A') aces += 1;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return aces > 0;
};

const isBlackjack = (hand: Card[]) =>
  hand.length === 2 && getHandValue(hand) === 21;

const drawCard = (deck: Card[]) => {
  const [card, ...rest] = deck;
  if (!card) {
    const nextDeck = buildDeck();
    const [replacement, ...remaining] = nextDeck;

    return {
      card: replacement!,
      deck: remaining,
    };
  }

  return { card, deck: rest };
};

const formatMoney = (value: number) => `$${value.toFixed(0)}`;

const BlackjackGame = () => {
  const [deck, setDeck] = useState<Card[]>(() => buildDeck());
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [phase, setPhase] = useState<Phase>('betting');
  const [bankroll, setBankroll] = useState(INITIAL_BANKROLL);
  const [bet, setBet] = useState(INITIAL_BET);
  const [currentBet, setCurrentBet] = useState(0);
  const [message, setMessage] = useState(
    'Place a bet and deal a hand. Blackjack pays 3:2.',
  );
  const [stats, setStats] = useState<RoundStats>({
    wins: 0,
    losses: 0,
    pushes: 0,
    blackjacks: 0,
  });
  const [roundCount, setRoundCount] = useState(0);
  const [hasDoubled, setHasDoubled] = useState(false);
  const [actionsTaken, setActionsTaken] = useState(0);

  const playerTotal = getHandValue(playerHand);
  const dealerTotal = getHandValue(dealerHand);
  const revealDealer = phase === 'dealer-turn' || phase === 'round-over';
  const dealerVisibleHand = revealDealer ? dealerHand : dealerHand.slice(0, 1);
  const dealerVisibleTotal = getHandValue(dealerVisibleHand);
  const canAct = phase === 'player-turn';
  const canDouble =
    canAct &&
    actionsTaken === 0 &&
    playerHand.length === 2 &&
    bankroll >= currentBet;
  const canSurrender = canAct && actionsTaken === 0 && playerHand.length === 2;

  const updateStats = (kind: keyof RoundStats) => {
    setStats((previous) => ({
      ...previous,
      [kind]: previous[kind] + 1,
    }));
  };

  const settleRound = (
    outcome: 'win' | 'loss' | 'push' | 'blackjack',
    nextDealerHand: Card[],
    nextPlayerHand: Card[],
    wager = currentBet,
  ) => {
    const nextPlayerTotal = getHandValue(nextPlayerHand);
    const nextDealerTotal = getHandValue(nextDealerHand);

    if (outcome === 'blackjack') {
      setBankroll((previous) => previous + wager + wager * 1.5);
      setMessage(
        `Blackjack. You win ${formatMoney(wager * 1.5)} on top of your bet.`,
      );
      updateStats('wins');
      updateStats('blackjacks');
    } else if (outcome === 'win') {
      setBankroll((previous) => previous + wager * 2);
      setMessage(
        `You win ${formatMoney(
          wager,
        )}. ${nextPlayerTotal} beats dealer ${nextDealerTotal}.`,
      );
      updateStats('wins');
    } else if (outcome === 'push') {
      setBankroll((previous) => previous + wager);
      setMessage(`Push. Both hands land on ${nextPlayerTotal}.`);
      updateStats('pushes');
    } else {
      setMessage(
        nextPlayerTotal > 21
          ? `Bust. You lose ${formatMoney(wager)}.`
          : `Dealer wins with ${nextDealerTotal} against your ${nextPlayerTotal}.`,
      );
      updateStats('losses');
    }

    setDealerHand(nextDealerHand);
    setPlayerHand(nextPlayerHand);
    setCurrentBet(0);
    setPhase('round-over');
    setRoundCount((previous) => previous + 1);
  };

  const startRound = () => {
    if (phase === 'player-turn' || phase === 'dealer-turn') return;
    if (bankroll < bet) return;

    let nextDeck = deck.length < 15 ? buildDeck() : [...deck];

    const playerCards: Card[] = [];
    const dealerCards: Card[] = [];

    for (let i = 0; i < 2; i += 1) {
      const playerDraw = drawCard(nextDeck);
      playerCards.push(playerDraw.card);
      nextDeck = playerDraw.deck;

      const dealerDraw = drawCard(nextDeck);
      dealerCards.push(dealerDraw.card);
      nextDeck = dealerDraw.deck;
    }

    setDeck(nextDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setPhase('player-turn');
    setCurrentBet(bet);
    setBankroll((previous) => previous - bet);
    setHasDoubled(false);
    setActionsTaken(0);

    const playerHasBlackjack = isBlackjack(playerCards);
    const dealerHasBlackjack = isBlackjack(dealerCards);

    if (playerHasBlackjack && dealerHasBlackjack) {
      setPhase('round-over');
      setBankroll((previous) => previous + bet);
      setCurrentBet(0);
      setMessage('Both hands have blackjack. Push.');
      updateStats('pushes');
      setRoundCount((previous) => previous + 1);
      return;
    }

    if (playerHasBlackjack) {
      settleRound('blackjack', dealerCards, playerCards, bet);
      return;
    }

    if (dealerHasBlackjack) {
      settleRound('loss', dealerCards, playerCards, bet);
      return;
    }

    setMessage('Hit, stand, double, or surrender.');
  };

  const hit = () => {
    if (!canAct) return;

    const drawn = drawCard(deck);
    const nextPlayerHand = [...playerHand, drawn.card];

    setDeck(drawn.deck);
    setPlayerHand(nextPlayerHand);
    setActionsTaken((previous) => previous + 1);

    if (getHandValue(nextPlayerHand) > 21) {
      settleRound('loss', dealerHand, nextPlayerHand);
      return;
    }

    setMessage('Your move.');
  };

  const finishDealerTurn = (
    currentDeck = deck,
    currentPlayerHand = playerHand,
    wager = currentBet,
  ) => {
    let nextDeck = [...currentDeck];
    const nextDealerHand = [...dealerHand];

    setPhase('dealer-turn');

    while (getHandValue(nextDealerHand) < 17) {
      const drawn = drawCard(nextDeck);
      nextDealerHand.push(drawn.card);
      nextDeck = drawn.deck;
    }

    setDeck(nextDeck);

    const nextDealerTotal = getHandValue(nextDealerHand);
    const nextPlayerTotal = getHandValue(currentPlayerHand);

    if (nextDealerTotal > 21) {
      settleRound('win', nextDealerHand, currentPlayerHand, wager);
      return;
    }

    if (nextPlayerTotal > nextDealerTotal) {
      settleRound('win', nextDealerHand, currentPlayerHand, wager);
      return;
    }

    if (nextPlayerTotal === nextDealerTotal) {
      settleRound('push', nextDealerHand, currentPlayerHand, wager);
      return;
    }

    settleRound('loss', nextDealerHand, currentPlayerHand, wager);
  };

  const stand = () => {
    if (!canAct) return;
    setMessage('Dealer draws to 17.');
    finishDealerTurn(deck, playerHand, currentBet);
  };

  const doubleDown = () => {
    if (!canDouble) return;

    const doubledBet = currentBet * 2;
    const drawn = drawCard(deck);
    const nextPlayerHand = [...playerHand, drawn.card];

    setDeck(drawn.deck);
    setPlayerHand(nextPlayerHand);
    setBankroll((previous) => previous - currentBet);
    setCurrentBet(doubledBet);
    setHasDoubled(true);
    setActionsTaken(1);

    if (getHandValue(nextPlayerHand) > 21) {
      settleRound('loss', dealerHand, nextPlayerHand, doubledBet);
      return;
    }

    setMessage('Double down locked in. Dealer plays out the hand.');
    finishDealerTurn(drawn.deck, nextPlayerHand, doubledBet);
  };

  const surrender = () => {
    if (!canSurrender) return;

    setBankroll((previous) => previous + currentBet / 2);
    setCurrentBet(0);
    setPhase('round-over');
    setMessage(
      `You surrender and recover ${formatMoney(
        currentBet / 2,
      )}. The dealer keeps the rest.`,
    );
    updateStats('losses');
    setRoundCount((previous) => previous + 1);
  };

  const resetSession = () => {
    setDeck(buildDeck());
    setDealerHand([]);
    setPlayerHand([]);
    setPhase('betting');
    setBankroll(INITIAL_BANKROLL);
    setBet(INITIAL_BET);
    setCurrentBet(0);
    setMessage('Fresh shoe ready. Place a bet and deal a hand.');
    setStats({
      wins: 0,
      losses: 0,
      pushes: 0,
      blackjacks: 0,
    });
    setRoundCount(0);
    setHasDoubled(false);
    setActionsTaken(0);
  };

  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col gap-6 pb-8'>
      <section className='overflow-hidden rounded-[2rem] border border-emerald-900/50 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_45%),linear-gradient(135deg,_#052e16,_#14532d_40%,_#022c22)] p-6 text-white shadow-2xl shadow-emerald-950/40'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-2xl'>
            <div className='mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-emerald-200/80'>
              <IconCards size={18} />
              Single-player table
            </div>
            <h1 className='mb-3 font-display text-white'>Blackjack</h1>
            <p className='max-w-xl text-sm text-emerald-50/90 sm:text-base'>
              Beat the dealer without going over 21. Dealer hits until 17.
              Natural blackjack pays 3:2.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            <ScoreCard
              icon={<IconCoin size={18} />}
              label='Bankroll'
              value={formatMoney(bankroll)}
            />
            <ScoreCard
              icon={<IconChevronRight size={18} />}
              label='Bet'
              value={currentBet > 0 ? formatMoney(currentBet) : formatMoney(bet)}
            />
            <ScoreCard
              icon={<IconRosetteDiscountCheck size={18} />}
              label='Wins'
              value={`${stats.wins}`}
            />
            <ScoreCard
              icon={<IconSparkles size={18} />}
              label='Blackjacks'
              value={`${stats.blackjacks}`}
            />
          </div>
        </div>
      </section>

      <section className='grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]'>
        <div className='rounded-[2rem] border border-emerald-950/10 bg-white p-4 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20 sm:p-6'>
          <div className='rounded-[1.75rem] bg-[linear-gradient(180deg,_rgba(240,253,244,0.96),_rgba(209,250,229,0.88))] p-4 ring-1 ring-emerald-900/10 dark:bg-[linear-gradient(180deg,_rgba(6,78,59,0.95),_rgba(2,44,34,0.96))] dark:ring-emerald-100/10 sm:p-5'>
            <div className='grid gap-5'>
              <HandPanel
                cards={dealerHand}
                label='Dealer'
                total={revealDealer ? dealerTotal : dealerVisibleTotal}
                hideSecondCard={!revealDealer}
                subtitle={
                  revealDealer
                    ? isSoftHand(dealerHand)
                      ? 'Soft hand'
                      : 'Dealer resolved'
                    : 'One card hidden'
                }
              />

              <div className='h-px bg-emerald-950/10 dark:bg-white/10' />

              <HandPanel
                cards={playerHand}
                label='Player'
                total={playerTotal}
                subtitle={
                  playerHand.length === 0
                    ? 'Waiting for the deal'
                    : isSoftHand(playerHand)
                      ? 'Soft hand'
                      : hasDoubled
                        ? 'Doubled down'
                        : 'Live hand'
                }
              />
            </div>
          </div>
        </div>

        <aside className='flex flex-col gap-4'>
          <div className='rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20'>
            <div className='mb-4 flex items-center justify-between gap-3'>
              <div>
                <h3 className='text-xl'>Table controls</h3>
                <p className='text-sm text-slate-600 dark:text-slate-300'>
                  {message}
                </p>
              </div>
              <Button
                color='transparent'
                compact
                onClick={resetSession}
                className='rounded-full border border-slate-200 dark:border-white/10'
              >
                <IconRefresh size={18} />
              </Button>
            </div>

            <div className='mb-5'>
              <div className='mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400'>
                Choose bet
              </div>
              <div className='grid grid-cols-2 gap-2'>
                {BET_OPTIONS.map((amount) => (
                  <button
                    key={amount}
                    type='button'
                    onClick={() => setBet(amount)}
                    disabled={phase === 'player-turn' || phase === 'dealer-turn'}
                    className={[
                      'rounded-2xl border px-4 py-3 text-left transition',
                      amount === bet
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-100'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10',
                      (phase === 'player-turn' || phase === 'dealer-turn') &&
                        'cursor-not-allowed opacity-50',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className='text-xs uppercase tracking-[0.2em] opacity-60'>
                      Chip
                    </div>
                    <div className='text-lg font-semibold'>
                      {formatMoney(amount)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <Button
                onClick={startRound}
                disabled={
                  phase === 'player-turn' ||
                  phase === 'dealer-turn' ||
                  bankroll < bet
                }
                fullWidth
                className='justify-center rounded-2xl'
              >
                Deal hand
              </Button>
              <Button
                onClick={hit}
                disabled={!canAct}
                fullWidth
                className='justify-center rounded-2xl'
              >
                Hit
              </Button>
              <Button
                onClick={stand}
                disabled={!canAct}
                fullWidth
                className='justify-center rounded-2xl'
              >
                Stand
              </Button>
              <Button
                onClick={doubleDown}
                disabled={
                  canDouble ? false : 'Double only on your first decision.'
                }
                fullWidth
                className='justify-center rounded-2xl'
              >
                Double
              </Button>
              <Button
                onClick={surrender}
                disabled={
                  canSurrender ? false : 'Surrender only before taking a hit.'
                }
                fullWidth
                className='justify-center rounded-2xl'
              >
                Surrender
              </Button>
              <Button
                onClick={startRound}
                disabled={phase !== 'round-over' || bankroll < bet}
                fullWidth
                className='justify-center rounded-2xl'
              >
                Next round
              </Button>
            </div>

            {bankroll < bet && phase !== 'player-turn' && phase !== 'dealer-turn' && (
              <p className='mt-4 text-sm font-medium text-red-600 dark:text-red-400'>
                Bankroll too low for the selected bet. Reset the table or lower
                the stake.
              </p>
            )}
          </div>

          <div className='rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20'>
            <h3 className='mb-3 text-xl'>Session stats</h3>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <StatTile label='Rounds played' value={`${roundCount}`} />
              <StatTile label='Losses' value={`${stats.losses}`} />
              <StatTile label='Pushes' value={`${stats.pushes}`} />
              <StatTile
                label='Deck status'
                value={`${deck.length} cards`}
              />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

const ScoreCard = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur'>
      <div className='mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-emerald-100/80'>
        {icon}
        {label}
      </div>
      <div className='text-2xl font-semibold text-white'>{value}</div>
    </div>
  );
};

const StatTile = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className='rounded-2xl bg-slate-50 p-4 dark:bg-slate-950'>
      <div className='text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400'>
        {label}
      </div>
      <div className='mt-1 text-xl font-semibold'>{value}</div>
    </div>
  );
};

const HandPanel = ({
  cards,
  hideSecondCard = false,
  label,
  total,
  subtitle,
}: {
  cards: Card[];
  hideSecondCard?: boolean;
  label: string;
  total: number;
  subtitle: string;
}) => {
  return (
    <section>
      <div className='mb-3 flex items-end justify-between gap-3'>
        <div>
          <div className='text-xs font-semibold uppercase tracking-[0.24em] text-emerald-900/60 dark:text-emerald-100/70'>
            {label}
          </div>
          <div className='text-sm text-emerald-950/80 dark:text-emerald-50/80'>
            {subtitle}
          </div>
        </div>
        <div className='rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-50'>
          Total: {cards.length === 0 ? '0' : total}
        </div>
      </div>

      <div className='flex min-h-[10rem] flex-wrap gap-3'>
        {cards.length === 0 ? (
          <div className='flex w-full items-center justify-center rounded-[1.5rem] border border-dashed border-emerald-900/20 bg-white/50 px-4 py-10 text-sm text-emerald-950/60 dark:border-white/15 dark:bg-black/10 dark:text-emerald-50/60'>
            No cards on the felt yet.
          </div>
        ) : (
          cards.map((card, index) => (
            <PlayingCard
              key={card.id}
              card={card}
              hidden={hideSecondCard && index === 1}
            />
          ))
        )}
      </div>
    </section>
  );
};

const PlayingCard = ({
  card,
  hidden,
}: {
  card: Card;
  hidden?: boolean;
}) => {
  if (hidden) {
    return (
      <div className='relative h-40 w-28 overflow-hidden rounded-[1.4rem] border border-emerald-950/50 bg-[linear-gradient(135deg,_#064e3b,_#022c22)] shadow-lg shadow-emerald-950/20'>
        <div className='absolute inset-2 rounded-[1rem] border border-white/15 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.16),_transparent_25%),repeating-linear-gradient(135deg,_rgba(255,255,255,0.1)_0px,_rgba(255,255,255,0.1)_8px,_transparent_8px,_transparent_16px)]' />
      </div>
    );
  }

  return (
    <div className='flex h-40 w-28 flex-col justify-between rounded-[1.4rem] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff,_#f8fafc)] p-3 shadow-lg shadow-emerald-950/10'>
      <div className={`text-lg font-bold ${SUIT_COLORS[card.suit]}`}>
        <div>{card.rank}</div>
        <div className='text-xl leading-none'>{SUIT_SYMBOLS[card.suit]}</div>
      </div>
      <div className={`self-center text-4xl ${SUIT_COLORS[card.suit]}`}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div className={`rotate-180 self-end text-lg font-bold ${SUIT_COLORS[card.suit]}`}>
        <div>{card.rank}</div>
        <div className='text-xl leading-none'>{SUIT_SYMBOLS[card.suit]}</div>
      </div>
    </div>
  );
};

export default BlackjackGame;
