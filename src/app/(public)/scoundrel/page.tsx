import ScoundrelElement from './scoundrel-element';
import { Suspense } from 'react';
import Loading from 'components/loading';
import { lang } from 'utils/language';
import ScoundrelHighscore from './highscore';

const ScoundrelPage = () => {
  return (
    <div className='flex flex-col gap-2'>
      <ScoundrelElement />
      <Suspense fallback={<Loading msg={lang('Hämtar...', 'Fetching...')} />}>
        <ScoundrelHighscore />
      </Suspense>
    </div>
  );
};

export default ScoundrelPage;
