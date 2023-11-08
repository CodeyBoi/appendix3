import useKeySequence from 'hooks/use-key-sequence';

const setEnabled = (enabled: boolean) => {
  if (typeof window === 'undefined') {
    return;
  }
  if (enabled) {
    document.documentElement.classList.add('slagverk');
  } else {
    document.documentElement.classList.remove('slagverk');
  }
};

export const useSlagverkEasterEgg = () => {
  useKeySequence(['s', 'l', 'a', 'g', 'v', 'e', 'r', 'k'], () =>
    setEnabled(true),
  );
};
