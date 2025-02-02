import React from 'react';
import CorpsClicker from './corps-clicker';

const CorpsClickerPage = () => {
  return (
    <div className='flex flex-col gap-4'>
      <h2>Corps Clicker</h2>
      <CorpsClicker
        gameData={{
          startDate: new Date(),
          daysPassed: 0,
          points: 0,
          totalPoints: 0,
          upgradeLevels: {
            board: 0,
            pr: 0,
            probationaryStudent: 0,
            riotGig: 0,
            timeMachine: 0,
          },
        }}
      />
    </div>
  );
};

export default CorpsClickerPage;
