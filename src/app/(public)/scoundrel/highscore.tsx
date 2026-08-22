'use client';

import CorpsDisplay from 'components/corps/display';
import Loading from 'components/loading';
import { api } from 'trpc/react';
import { lang } from 'utils/language';

const ScoundrelHighscore = () => {
  const { data: highscores, isInitialLoading } =
    api.games.getScoundrelHighscores.useQuery();

  return (
    <div className='flex flex-col gap-2'>
      <h4>Highscore</h4>
      {isInitialLoading && <Loading msg={lang('Hämtar...', 'Fetching...')} />}
      {!isInitialLoading && highscores && highscores.length > 0 && (
        <div className='flex max-w-max flex-col gap-1'>
          {highscores.map((highscore) => (
            <div
              key={highscore.corps.id}
              className='flex justify-between gap-8'
            >
              <CorpsDisplay corps={highscore.corps} />
              <span>{highscore.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoundrelHighscore;
