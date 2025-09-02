import { lang } from 'utils/language';
import SetCard from './card';

const SetRules = () => {
  return (
    <div className='flex flex-col gap-2'>
      {lang(
        'Spelets mål är att för varje samling av 12 kort hitta ett Set bestående av tre kort. Varje kort har fyra olika egenskaper, som kan variera enligt följande:',
        'The goal of the game is for each collection of 12 cards find a Set consisting of three cards. Each card has four different properties, which can vary as follows:',
      )}
      <div className='grid grid-cols-4 gap-2'>
        <div className='flex w-28 flex-col gap-1'>
          <h4>{lang('Form', 'Shape')}</h4>
          <SetCard shape='oval' color='red' fill='solid' amount='one' />
          <SetCard shape='wave' color='red' fill='solid' amount='one' />
          <SetCard shape='diamond' color='red' fill='solid' amount='one' />
        </div>
        <div className='flex w-28 flex-col gap-1'>
          <h4>{lang('Färg', 'Color')}</h4>
          <SetCard shape='oval' color='red' fill='solid' amount='one' />
          <SetCard shape='oval' color='blue' fill='solid' amount='one' />
          <SetCard shape='oval' color='yellow' fill='solid' amount='one' />
        </div>
        <div className='flex w-28 flex-col gap-1'>
          <h4>{lang('Antal', 'Amount')}</h4>
          <SetCard shape='wave' color='blue' fill='solid' amount='one' />
          <SetCard shape='wave' color='blue' fill='solid' amount='two' />
          <SetCard shape='wave' color='blue' fill='solid' amount='three' />
        </div>
        <div className='flex w-28 flex-col gap-1'>
          <h4>{lang('Fyllnad', 'Fill')}</h4>
          <SetCard shape='diamond' color='yellow' fill='solid' amount='one' />
          <SetCard shape='diamond' color='yellow' fill='striped' amount='one' />
          <SetCard shape='diamond' color='yellow' fill='clear' amount='one' />
        </div>
      </div>
      {lang(
        'Ett Set består av tre kort där varje egenskap alla antingen är samma på varje kort, eller är olika på varje kort. Alla egenskaper (form, färg, antal och fyllnad) måste separat följa denna regel.',
        'A Set consists of three cards where every feature either is the same on each card, or different on each card. All features (shape, color, amount, and fill) must separately follow this rule.',
      )}
      <div className='h-1' />
      <h4>{lang('Giltiga Set', 'Valid Sets')}</h4>
      <div className='flex max-w-sm gap-2'>
        <SetCard shape='oval' color='yellow' fill='striped' amount='two' />
        <SetCard shape='diamond' color='blue' fill='solid' amount='one' />
        <SetCard shape='wave' color='red' fill='clear' amount='three' />
      </div>
      <div className='flex max-w-sm gap-2'>
        <SetCard shape='diamond' color='blue' fill='striped' amount='two' />
        <SetCard shape='oval' color='blue' fill='striped' amount='two' />
        <SetCard shape='wave' color='blue' fill='striped' amount='two' />
      </div>
      <div className='flex max-w-sm gap-2'>
        <SetCard shape='wave' color='red' fill='clear' amount='one' />
        <SetCard shape='wave' color='red' fill='striped' amount='two' />
        <SetCard shape='wave' color='red' fill='solid' amount='three' />
      </div>
      <div className='h-4' />
      <h4>{lang('Ogiltiga Set', 'Invalid Sets')}</h4>
      <div className='flex max-w-sm gap-2'>
        <SetCard shape='oval' color='yellow' fill='striped' amount='two' />
        <SetCard shape='diamond' color='blue' fill='solid' amount='two' />
        <SetCard shape='wave' color='red' fill='clear' amount='three' />
      </div>
      <div className='flex max-w-sm gap-2'>
        <SetCard shape='diamond' color='blue' fill='striped' amount='two' />
        <SetCard shape='oval' color='yellow' fill='striped' amount='two' />
        <SetCard shape='wave' color='blue' fill='striped' amount='two' />
      </div>
      <div className='flex max-w-sm gap-2'>
        <SetCard shape='wave' color='red' fill='clear' amount='one' />
        <SetCard shape='wave' color='red' fill='clear' amount='two' />
        <SetCard shape='oval' color='red' fill='solid' amount='three' />
      </div>
    </div>
  );
};

export default SetRules;
