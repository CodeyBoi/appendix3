import Button from 'components/input/button';

const Verified = () => {
  return (
    <div className='fixed top-0 left-0 flex items-center justify-center w-screen h-screen polka'>
      <div className='flex flex-col items-center gap-3 p-4 bg-red-600 shadow-2xl'>
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
