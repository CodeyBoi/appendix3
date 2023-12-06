import { useEffect, useState } from 'react';
import { getKeyCode } from 'utils/key';

const useKeySequence = (sequence: string[], callback: () => void) => {
  const [pressedKeys, setPressedKeys] = useState(0);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const keyCode = getKeyCode(event);
      const currentKey = sequence[pressedKeys]?.toLowerCase();
      if (keyCode === currentKey) {
        // Key matched!
        if (pressedKeys === sequence.length - 1) {
          // If at the last key in the sequence, run the callback
          callback();
        } else {
          // Else, go the the next key in the sequence
          setPressedKeys(pressedKeys + 1);
        }
      } else {
        // If pressed key does not match, reset sequence
        setPressedKeys(0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sequence, callback, pressedKeys]);
};

export default useKeySequence;
