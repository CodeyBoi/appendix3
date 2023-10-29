import Button from 'components/input/button';

const Verified = () => {
  return (
    <div className='polka fixed left-0 top-0 flex h-screen w-screen items-center justify-center font-display'>
      <div className='flex flex-col items-center gap-3 bg-red-600 p-4 shadow-2xl'>
        <h4 className='max-w-3xl text-center text-white'>
          Din inloggning har blivit bekräftad! Du kan nu återgå till din
          föregående flik, eller klicka på knappen nedan för att komma direkt
          till startsidan.
        </h4>
        <div className='flex justify-center'>
          <Button className='border border-white' href='/'>
            Till startsidan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Verified;
