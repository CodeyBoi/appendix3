import { useEffect } from 'react';
import { getKeyCode } from 'utils/key';

const useKeyDown = (
  key: string | string[],
  callback: (() => void) | ((arg0: KeyboardEvent) => void),
) => {
  const keys = Array.isArray(key) ? key : [key];
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const keyCode = getKeyCode(event);
      if (keys.some((key) => keyCode.toLowerCase() === key.toLowerCase())) {
        callback(event);
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [key, callback]);
};

export default useKeyDown;
