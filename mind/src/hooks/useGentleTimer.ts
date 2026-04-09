import { useState, useEffect, useCallback, useRef } from 'react';

export function useGentleTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // in seconds
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now() - elapsed * 1000;
    }
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [elapsed, tick]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    startTimeRef.current = null;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return {
    isRunning,
    elapsed,
    formatted: formatTime(elapsed),
    start,
    pause,
    reset,
    toggle: isRunning ? pause : start,
  };
}
