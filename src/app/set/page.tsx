import { Metadata } from 'next';
import SetGame from './set';
import SetHighscoreList from './highscore-list';

export const metadata: Metadata = {
  title: 'Set',
};

const SetPage = () => {
  return (
    <div className='flex flex-col gap-2'>
      <SetGame />
      <div className='h-4' />
      <SetHighscoreList />
    </div>
  );
};

export default SetPage;
