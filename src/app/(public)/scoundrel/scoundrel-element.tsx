'use client';

import Button from 'components/input/button';
import { useEffect, useState } from 'react';
import { getMonsterStrength, ScoundrelGame } from './scoundrel';
import { lang } from 'utils/language';
import RoomElement from './room';
import { Card, cardToString, Rank, Suit } from 'utils/card';
import { cn } from 'utils/class-names';
import { filterNone } from 'utils/array';
import { Metadata } from 'next';
import { api } from 'trpc/react';

export const metadata: Metadata = {
  title: 'Scoundrel',
};

const ScoundrelElement = () => {
  const utils = api.useUtils();
  const [gameState, _setGameState] = useState(new ScoundrelGame());
  const setGameState = (newState: ScoundrelGame) => {
    _setGameState(new ScoundrelGame(newState));
  };
  const [monsterLimitSuit, setMonsterLimitSuit] = useState<Suit>('spade');
  const [score, setScore] = useState<number | undefined>();
  const [healthChangePreview, setHealthChangePreview] = useState<
    number | undefined
  >();
  const [gameRunning, setGameRunning] = useState(true);
  const [startedAt, _setStartedAt] = useState(() => new Date());

  const scoreMutation = api.games.createScoundrelScore.useMutation();

  const endGame = () => {
    const finalScore = gameState.calculateScore();
    setScore(finalScore);
    setGameRunning(false);
    scoreMutation.mutate({ score: finalScore, startedAt });
    void utils.games.getScoundrelHighscores.invalidate();
  };

  useEffect(() => {
    const game = new ScoundrelGame();
    game.fillRoom();
    setGameState(game);
  }, []);

  const handleCardClick = (card: Card, index: number, useWeapon: boolean) => {
    if (!gameRunning) {
      return;
    }
    switch (card.suit) {
      case 'spade':
      case 'club':
        if (
          gameState.fightMonster(getMonsterStrength(card.rank), useWeapon) ===
          'weapon'
        ) {
          setMonsterLimitSuit(card.suit);
        }
        break;
      case 'heart':
        gameState.heal(card.rank);
        break;
      case 'diamond':
        gameState.equipWeapon(card.rank);
        break;
    }
    gameState.removeRoomCard(index);

    // Check if game is over
    if (gameState.health <= 0) {
      endGame();
    } else if (filterNone(gameState.room).length <= 1) {
      if (gameState.fillRoom() === 'complete') {
        endGame();
      }
    }

    setHealthChangePreview(undefined);
    setGameState(gameState);
  };

  const equippedWeapon = gameState.equippedWeapon;

  const healthChangePreviewElement =
    healthChangePreview !== undefined ? (
      <span
        className={cn(
          healthChangePreview <= 0 ? 'text-red-600' : 'text-green-600',
        )}
      >{`${
        healthChangePreview > 0 ? '+' : healthChangePreview === 0 ? '-' : ''
      }${healthChangePreview}${
        gameState.health + healthChangePreview <= 0 ? ' -> DEATH' : ''
      }`}</span>
    ) : (
      ''
    );

  return (
    <div className='flex flex-col gap-2'>
      <h2>Scoundrel</h2>

      {score !== undefined && <h4>Score: {score}</h4>}

      <div>
        <div>Deck: {gameState.deck.length}</div>
        <div>
          Health: {gameState.health} {healthChangePreviewElement}
        </div>
      </div>

      <RoomElement
        room={gameState.room}
        equippedWeapon={gameState.equippedWeapon}
        onClick={handleCardClick}
        onMouseEnter={(card, useWeapon) => {
          const newState = new ScoundrelGame(gameState);
          switch (card.suit) {
            case 'spade':
            case 'club':
              newState.fightMonster(getMonsterStrength(card.rank), useWeapon);
              setHealthChangePreview(newState.health - gameState.health);
              break;
            case 'heart':
              newState.heal(card.rank);
              setHealthChangePreview(newState.health - gameState.health);
              break;
            case 'diamond':
              break;
          }
        }}
        onMouseLeave={() => {
          setHealthChangePreview(undefined);
        }}
      />

      <div className='flex select-none flex-col gap-2'>
        <h5>Weapon:</h5>
        {equippedWeapon ? (
          <div className='flex gap-2'>
            <p className='mt-2 h-auto w-min text-8xl text-red-600'>
              {cardToString({ rank: equippedWeapon.strength, suit: 'diamond' })}
            </p>
            {equippedWeapon.monsterStrengthLimit && (
              <p className='mt-2 h-auto w-min text-8xl'>
                {cardToString({
                  rank:
                    equippedWeapon.monsterStrengthLimit === 14
                      ? 1
                      : (equippedWeapon.monsterStrengthLimit as Rank),
                  suit: monsterLimitSuit,
                })}
              </p>
            )}
          </div>
        ) : (
          <p className='mt-2 h-auto w-min text-8xl text-transparent'>
            {cardToString({ rank: 1, suit: 'diamond' })}
          </p>
        )}
      </div>

      <div className='flex gap-2'>
        <Button
          disabled={
            gameState.room.length !== filterNone(gameState.room).length
              ? 'You cannot skip in the middle of a room!'
              : gameState.hasSkipped
              ? 'You cannot skip two rooms in a row!'
              : false
          }
          onClick={() => {
            gameState.skipRoom();
            setGameState(gameState);
          }}
        >
          Skip room
        </Button>
        <Button
          onClick={() => {
            const game = new ScoundrelGame();
            game.fillRoom();
            setGameState(game);
            setScore(undefined);
            setGameRunning(true);
          }}
        >
          {lang('Nytt spel', 'New game')}
        </Button>
      </div>
    </div>
  );
};

export default ScoundrelElement;
