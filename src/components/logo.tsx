import Link from 'next/link';
import { isAprilFools } from 'utils/date';

const Logo = () => {
  return (
    <Link href='/'>
      <div className='cursor-pointer font-castelar text-2xl text-white'>
        {isAprilFools() ? 'Bihålan' : 'Blindtarmen'}
      </div>
    </Link>
  );
};

export default Logo;
