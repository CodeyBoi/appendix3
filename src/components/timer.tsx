import { useEffect, useState } from 'react';

interface TimerProps {
  stopped?: boolean;
}

const Timer = ({ stopped = false }: TimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (stopped) {
        return;
      }
      setSeconds(seconds + 1);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [seconds, stopped]);

  return (
    <span>
      {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
    </span>
  );
};

export default Timer;
