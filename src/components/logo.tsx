import Link from 'next/link';

const Logo = () => {
  const date = new Date();
  const isAprilFools = date.getMonth() === 3 && date.getDate() === 1;
  return (
    <Link href='/'>
      <div className='cursor-pointer font-castelar text-2xl text-white'>
        {isAprilFools ? 'Bihålan' : 'Blindtarmen'}
      </div>
    </Link>
  );
};

export default Logo;
