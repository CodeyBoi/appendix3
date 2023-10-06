import Link from 'next/link';

const Logo = () => {
  const date = new Date();
  const isAprilFools = date.getMonth() === 3 && date.getDate() === 1;
  return (
    <Link href='/'>
      <div
        style={{ fontFamily: 'Castellar' }}
        className='text-2xl cursor-pointer'
      >
        {isAprilFools ? 'Bihålan' : 'Umpisuoli'}
      </div>
    </Link>
  );
};

export default Logo;
