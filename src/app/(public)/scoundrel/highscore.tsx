import { api } from 'trpc/server';
import CorpsDisplay from 'components/corps/display';

const ScoundrelHighscore = async () => {
  const highscores = await api.games.getScoundrelHighscores.query();

  if (highscores.length === 0) {
    return;
  }

  return (
    <div className='flex flex-col gap-2'>
      <h4>Highscore</h4>
      <div className='flex max-w-max flex-col gap-1'>
        {highscores.map((highscore) => (
          <div key={highscore.corps.id} className='flex justify-between gap-8'>
            <CorpsDisplay corps={highscore.corps} />
            <span>{highscore.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoundrelHighscore;
