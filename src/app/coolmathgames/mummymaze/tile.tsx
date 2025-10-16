import { Direction } from './mummy-maze';

interface MummyMazeTileProps {
  bgColor: string;
  walls?: Set<Direction>;
}

const WALL_COLORS = {
  light: '#b89365',
  dark: '#453020',
};

const MummyMazeTile = ({ bgColor, walls = new Set() }: MummyMazeTileProps) => {
  return (
    <>
      <div className='z-0 h-full w-full' style={{ backgroundColor: bgColor }} />
      {walls.has('up') && (
        <div className='pointer-events-none flex gap-0'>
          <div className='absolute z-20 flex h-full w-full translate-y-[-110%] flex-col gap-0'>
            <div
              className='h-[5%]'
              style={{ backgroundColor: WALL_COLORS.light }}
            />
            <div
              className='h-[5%]'
              style={{
                background: `linear-gradient(180deg, ${WALL_COLORS.light} 0%, ${WALL_COLORS.dark} 100%)`,
              }}
            />
            <div
              className='h-[15%]'
              style={{ backgroundColor: WALL_COLORS.dark }}
            />
          </div>
          <div className='absolute z-10 flex h-full w-full translate-x-full translate-y-[-101%] flex-col gap-0'>
            <div className='h-[8%] w-[8%] bg-black' />
            <svg className='aspect-square w-[8%] fill-black' viewBox='0 0 1 1'>
              <polygon points='0,0 1,0 0,1' />
            </svg>
          </div>
        </div>
      )}
      {walls.has('left') && (
        <div className='pointer-events-none flex gap-0'>
          <div className='absolute z-30 flex h-[125%] w-[8%] translate-y-[-88%] flex-col gap-0'>
            <div
              className='h-[105%]'
              style={{ backgroundColor: WALL_COLORS.light }}
            />
            <div
              className='h-[5%]'
              style={{
                background: `linear-gradient(180deg, ${WALL_COLORS.light} 0%, ${WALL_COLORS.dark} 100%)`,
              }}
            />
            <div
              className='h-[15%]'
              style={{ backgroundColor: WALL_COLORS.dark }}
            />
          </div>
          <div className='absolute z-10 flex h-[125%] w-[8%] -translate-y-3/4 translate-x-full flex-col gap-0'>
            <div className='h-4/5 w-full bg-black' />
            <svg className='aspect-square w-full fill-black' viewBox='0 0 1 1'>
              <polygon points='0,0 1,0 0,1' />
            </svg>
          </div>
        </div>
      )}
    </>
  );
};

export default MummyMazeTile;
