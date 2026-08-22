import ScoundrelElement from './scoundrel-element';
import ScoundrelHighscore from './highscore';

const ScoundrelPage = () => {
  return (
    <div className='flex flex-col gap-2'>
      <ScoundrelElement />
      <ScoundrelHighscore />
    </div>
  );
};

export default ScoundrelPage;
