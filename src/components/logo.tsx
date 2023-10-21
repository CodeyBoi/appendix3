import Link from 'next/link';

const Logo = () => {
  const date = new Date();
  const isAprilFools = date.getMonth() === 3 && date.getDate() === 1;
  return (
    <Link href='/'>
      <div
        style={{ fontFamily: 'Castellar' }}
        className='text-2xl text-white cursor-pointer'
      >
        {isAprilFools ? 'Bihålan' : 'Blindtarmen'}
      </div>
    </Link>
  );
};

export default Logo;
