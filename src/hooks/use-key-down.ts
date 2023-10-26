import { useEffect } from 'react';

const getModifiers = (event: KeyboardEvent) => {
  const { altKey, ctrlKey, shiftKey } = event;
  const modifiers = [];
  if (altKey && event.key !== 'Alt') modifiers.push('alt');
  if (ctrlKey && event.key !== 'Control') modifiers.push('ctrl');
  if (shiftKey && event.key !== 'Shift') modifiers.push('shift');
  return modifiers;
};

const useKeyDown = (key: string, callback: () => void) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const modifiers = getModifiers(event);
      const keyCode =
        modifiers.length > 0
          ? `${modifiers.join('+')}+${event.key}`
          : event.key;
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
