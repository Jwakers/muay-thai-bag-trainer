import { useEffect, useState } from "react";

/**
 * Counts down from `initialTime` by 1 each second.
 * When `running` is false, the value stays at `initialTime` and does not tick.
 * When `running` becomes true, the counter resets to `initialTime` and runs.
 */
export function useTimer(initialTime: number, running = true): number {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [prevRunning, setPrevRunning] = useState(running);
  const [prevInitial, setPrevInitial] = useState(initialTime);

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
    if (!running || timeLeft === 0) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [running, timeLeft]);

  return running ? timeLeft : initialTime;
}
