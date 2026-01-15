import Link from 'next/link';
import { isAprilFools } from 'utils/date';

interface LogoProps {
  currentDate?: Date;
}

const Logo = ({ currentDate = new Date() }: LogoProps) => {
  return (
    <Link href='/'>
      <div className='cursor-pointer font-castelar text-2xl text-white'>
        {isAprilFools(currentDate) ? 'Bihålan' : 'Blindtarmen'}
      </div>
    </Link>
  );
};

export default Logo;
