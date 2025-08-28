import { useEffect, useState } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setSeconds(seconds + 1), 1000);
    return () => clearTimeout(timeout);
  }, [seconds]);

  return (
    <span>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span>
  )
}

export default Timer
