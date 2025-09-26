import { lang } from 'utils/language';
import CorpsInfobox from 'components/corps/infobox';

const Positions = () => {
  return (
    <div>
      <h2>{lang('Ansvarsposter', 'Positions of responsibility')}</h2>
      <div className='flex max-w-4xl flex-col space-y-4'>
        <div className='rounded border shadow-md dark:border-neutral-800'>
          <div className='flex flex-col space-y-2 p-4'>
            <h3>styrelsen</h3>
            bla bla lite text
            <div className='grid grid-cols-4 gap-4'>
              <div className='rounded border shadow-md dark:border-neutral-800'>
                Ordförande
                <CorpsInfobox id={"-"} open={true} />
              </div>
              <div className='rounded border shadow-md dark:border-neutral-800'>
                Sekreterare
                <CorpsInfobox id={"-"} open={true} />
              </div>
            </div>

          </div>
        </div>
        <div>
          <h3>trifselombud</h3>
          bla bla
        </div>
      </div>
    </div>
  );
};

export default Positions;

