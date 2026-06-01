import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  totalMinutes: number;
  onTimeUp?: () => void;
  autoStart?: boolean;
}

export function useTimer({ totalMinutes, onTimeUp, autoStart = false }: UseTimerOptions) {
  const [secondsLeft, setSecondsLeft] = useState(totalMinutes * 60);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUpRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setSecondsLeft(totalMinutes * 60);
    setIsRunning(false);
  }, [totalMinutes]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const totalSeconds = totalMinutes * 60;
  const elapsed = totalSeconds - secondsLeft;
  const percentLeft = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
  const isWarning = secondsLeft <= 300 && secondsLeft > 60;
  const isCritical = secondsLeft <= 60;

  return {
    secondsLeft,
    elapsed,
    display,
    percentLeft,
    isRunning,
    isWarning,
    isCritical,
    start,
    pause,
    reset,
  };
}
