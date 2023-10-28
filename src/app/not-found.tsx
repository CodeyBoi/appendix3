import Link from 'next/link';

const NotFound = () => {
  return (
    <div className='flex flex-col items-center gap-8 mt-24 text-red-600'>
      <h1>404</h1>
      <h3>Den här sidan verkar tyvärr ha supits bort!</h3>
      <Link href='/'>
        <div className='text-lg cursor-pointer hover:underline'>
          Tillbaka till startsidan
        </div>
      </Link>
    </div>
  );
};

export default NotFound;
