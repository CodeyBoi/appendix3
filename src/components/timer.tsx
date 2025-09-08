import { useEffect, useState } from 'react';

interface TimerProps {
  stopped?: boolean;
  start?: number;
}

const Timer = ({ stopped = false, start = new Date().getTime() }: TimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timeout = setInterval(() => {
      const millis = new Date().getTime() - start;
      if (stopped) {
        return;
      }
      setSeconds(millis / 1000); 
    }, 100);
    return () => {
      clearInterval(timeout);
    };
  }, [seconds, stopped]);

  return (
    <span>
      {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
    </span>
  );
};

export default Timer;
