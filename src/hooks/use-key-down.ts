import { useEffect } from 'react';
import { getKeyCode } from 'utils/key';

const useKeyDown = (key: string, callback: () => void) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const keyCode = getKeyCode(event);
      if (keyCode.toLowerCase() === key.toLowerCase()) {
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [key, callback]);
};

export default useKeyDown;
