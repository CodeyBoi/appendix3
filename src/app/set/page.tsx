import { Metadata } from 'next';
import SetGame from './set';
import { api } from 'trpc/server';
import CorpsDisplay from 'components/corps/display';

export const metadata: Metadata = {
  title: 'Set',
};

const SetPage = async () => {
  const highscores = await api.games.getSetHighscores.query();
  return (
    <div className='flex flex-col gap-2'>
      <SetGame />
      {highscores.length > 0 && (
        <>
          <div className='h-4' />
          <h4>Highscore</h4>
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
                  .{String(highscore.durationInMillis % 1000).padStart(3, '0')}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SetPage;
