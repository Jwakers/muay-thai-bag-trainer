import { useEffect, useRef, useState } from "react";

/**
 * Counts down from `initialTime` by 1 each second.
 * When `running` is false, the value stays at `initialTime` and does not tick.
 * When `running` becomes true, the counter resets to `initialTime` and runs.
 */
export function useTimer(initialTime: number, running = true): number {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [prevRunning, setPrevRunning] = useState(running);
  const [prevInitial, setPrevInitial] = useState(initialTime);
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  if (running !== prevRunning) {
    setPrevRunning(running);
    if (running) {
      setTimeLeft(initialTime);
    }
  }
  if (initialTime !== prevInitial) {
    setPrevInitial(initialTime);
    if (running) {
      setTimeLeft(initialTime);
    }
  }

  useEffect(() => {
    if (!running) return undefined;
    if (timeLeftRef.current <= 0) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0) {
          clearInterval(timer);
          return 0;
        }
        const next = t - 1;
        if (next <= 0) {
          clearInterval(timer);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  return running ? timeLeft : initialTime;
}
