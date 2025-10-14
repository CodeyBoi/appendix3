import { range } from 'utils/array';
import MummyMaze from './mummymaze';

const MummyMazePage = () => {
  const size = 10;
  return (
    <div>
      <MummyMaze
        size={[size, size]}
        walls={range(49).reduce((acc, _) => {
          const [x, y] = [
            Math.floor(Math.random() * size),
            Math.floor(Math.random() * size),
          ];
          if (x === 0 && y === 0) {
            return acc;
          }
          const hash = `${x}:${y}`;
          const direction =
            x === 0
              ? 'up'
              : y === 0
              ? 'left'
              : Math.random() > 0.5
              ? 'up'
              : 'left';
          acc.set(hash, (acc.get(hash) ?? new Set()).add(direction));
          return acc;
        }, new Map<string, Set<'up' | 'left'>>())}
        enemies={[
          { kind: 'mummy', pos: [6, 7], priority: 'horizontal' },
          { kind: 'mummy', pos: [1, 2], priority: 'vertical' },
          { kind: 'scorpion', pos: [6, 2], priority: 'horizontal' },
        ]}
        startPos={[2, 7]}
        goal={[2, 9]}
      />
    </div>
  );
};

export default MummyMazePage;
