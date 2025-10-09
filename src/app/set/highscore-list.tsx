'use client';

import CorpsDisplay from 'components/corps/display';
import Loading from 'components/loading';
import { api } from 'trpc/react';
import { lang } from 'utils/language';

const SetHighscoreList = () => {
  const { data: highscores, isFetching } =
    api.games.getSetHighscores.useQuery();

  return (
    <div className='flex flex-col gap-2'>
      <h4>Highscore</h4>
      {isFetching && <Loading msg={lang('Hämtar...', 'Fetching...')} />}
      {!isFetching && highscores && highscores.length > 0 && (
        <div className='flex max-w-max flex-col gap-1'>
          {highscores.map((highscore) => (
            <div
              key={highscore.corps.id}
              className='flex justify-between gap-8'
            >
              <CorpsDisplay corps={highscore.corps} />
              <span>
                {Math.floor(highscore.durationInMillis / 60 / 1000)}:
                {String(
                  Math.floor(highscore.durationInMillis / 1000) % 60,
                ).padStart(2, '0')}
                <span className='text-xs font-thin text-gray-500'>
                  .{String(highscore.durationInMillis % 1000).padStart(3, '0')}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SetHighscoreList;
