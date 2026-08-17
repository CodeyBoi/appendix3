'use client';

import Button from 'components/input/button';
import { useEffect, useState } from 'react';
import { getMonsterStrength, ScoundrelGame } from './scoundrel';
import { lang } from 'utils/language';
import RoomElement from './room';
import { Card, cardToString, Rank, Suit } from 'utils/card';
import { cn } from 'utils/class-names';
import { filterNone } from 'utils/array';

const ScoundrelElement = () => {
  const [gameState, _setGameState] = useState(new ScoundrelGame());
  const setGameState = (newState: ScoundrelGame) => {
    _setGameState(new ScoundrelGame(newState));
  };
  const [monsterLimitSuit, setMonsterLimitSuit] = useState<Suit>('spade');
  const [isWeaponSelected, setIsWeaponSelected] = useState(false);
  const [score, setScore] = useState<number | undefined>(undefined);

  useEffect(() => {
    const game = new ScoundrelGame();
    game.fillRoom();
    setGameState(game);
  }, []);

  const handleCardClick = (card: Card, index: number) => {
    switch (card.suit) {
      case 'spade':
      case 'club':
        if (
          gameState.killMonster(
            getMonsterStrength(card.rank),
            isWeaponSelected,
          ) === 'weapon'
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
      setScore(gameState.calculateScore());
    } else if (filterNone(gameState.room).length <= 1) {
      if (gameState.fillRoom() === 'complete') {
        setScore(gameState.calculateScore());
      }
    }

    setGameState(gameState);
  };

  const equippedWeapon = gameState.equippedWeapon;

  return (
    <div className='flex flex-col gap-2'>
      <h2>Scoundrel</h2>

      {score !== undefined && <h4>Score: {score}</h4>}

      <div>
        Deck: {gameState.deck.length}
        <br />
        Health: {gameState.health}
      </div>

      <RoomElement room={gameState.room} onClick={handleCardClick} />

      <div className='flex select-none flex-col gap-2'>
        <h5>Weapon:</h5>
        {equippedWeapon ? (
          <div className='flex gap-2'>
            <p
              className={cn(
                'mt-2 h-auto w-min text-6xl text-red-600 hover:cursor-pointer lg:text-8xl',
                isWeaponSelected && 'shadow-lg shadow-red-600',
              )}
              onClick={() => {
                setIsWeaponSelected(!isWeaponSelected);
              }}
            >
              {cardToString({ rank: equippedWeapon.strength, suit: 'diamond' })}
            </p>
            {equippedWeapon.monsterStrengthLimit && (
              <p className='mt-2 h-auto w-min text-6xl lg:text-8xl'>
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
          <p className='mt-2 h-auto w-min text-6xl text-transparent lg:text-8xl'>
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
            setIsWeaponSelected(false);
            setScore(undefined);
          }}
        >
          {lang('Nytt spel', 'New game')}
        </Button>
      </div>
    </div>
  );
};

export default ScoundrelElement;
