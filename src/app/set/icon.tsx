import { cn } from 'utils/class-names';
import { Card, Color, Fill, Shape } from './set';

const colors: Record<Color, string> = {
  blue: 'text-blue-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
};

const shapes: Record<Shape, string> = {
  diamond: `
           *█
           ██*
          █**█=
         ██  ██
        ██*  :██
       *██    *█*
      :██      ██*
      ██        ██-
     ██          ██
    ██=          .██
   *█*            +██
  =██              *█*
  █%                ██-
 ██                  ██
██                    ██
*██                  ██
 *█*                 █
  ██:               ██
   ██              ██:
   =██            *█*
    *█*          +██
     ██+         ██
      ██.       ██
       ██      ██.
       -██    ██*
        *█*  *█*
         ██. ██
          █**█
           ██.
           ** `,
  oval: `
       ██████████
    ████=      +███*
  ███+            *██:
 *██                ██=
 ██                  ██
██:                  -█*
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██                    ██
██+                  *█=
 ██                  ██
  ██:              *██
   ███-          =███
     ██████**██████
         ██████`,

  wave: `
    ██████=
 ████    ██████
██            ███
██              ██
 ██              ██
  ██=             ██
   ███            ██
    ██            ██
     ██           ██
     ██           ██
    :█-          ██
    ██          *█+
   ██:          ██
   ██          ██
  ██           ██
  ██          ██
 ██           ██
=█=           █*
██            ██
██             ██
██              ██
██               ███
 ██                ██
  ██                ██
   ███             ██
     █████.    █████
         *██████`,
}

const processShape = (shape: Shape, fill: Fill) => {
  const shapeStr = shapes[shape];

  if (fill === 'clear') {
    return shapeStr;
  }


  return shapeStr.split('\n').map((l) => l.trimEnd()).map((line, i) => {
    if (fill === 'solid' || i % 3 === 0) {
      const out = [];

      let hasSeenSolid = false;
      let hasSeenSpace = false;
      let idx = 0;

      while (idx < line.length && line.charAt(idx) !== '█') {
        out.push(line.charAt(idx))
        idx++;
      }
      while (idx < line.length && line.charAt(idx) === '█') {
        out.push(line.charAt(idx))
        idx++;
      }

      while (idx < line.length && line.charAt(idx) !== '█') {
        out.push('█');
        idx++;
      }

      while (idx < line.length) {
        out.push(line.charAt(idx));
        idx++;
      }

      console.log(line + '\n' + out.join(''));

      return out.join('')

      for (let i = 0; i < line.length; i++) {
        let c = line.charAt(i);
        const isSolid = c !== ' ';
        if (isSolid && !hasSeenSolid) {
          hasSeenSolid = true;
        } else if (!isSolid && hasSeenSolid) {
          
        }
      }

      const firstNonSpaceIndex = line.indexOf('█');
      if (firstNonSpaceIndex === -1) {
        return line;
      }
      return ' '.repeat(firstNonSpaceIndex) + '█'.repeat(line.length - firstNonSpaceIndex + 2);
    }
    return line;
  }).join('TEST\n');
}


export type SetIconProps = Omit<Card, 'amount'>;

const SetIcon = ({ shape, color, fill }: SetIconProps) => {
  return (
    <span className={colors[color]}>
    <pre className='text-[3px] whitespace-pre-wrap font-mono leading-none min-w-max'>
      {processShape(shape, fill)}
    </pre>
  </span>
  );
};

export default SetIcon;
