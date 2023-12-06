import useKeySequence from 'hooks/use-key-sequence';

export const useSlagverkEasterEgg = () => {
  useKeySequence(['s', 'l', 'a', 'g', 'v', 'e', 'r', 'k'], () => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('slagverk');
    }
  });
};
