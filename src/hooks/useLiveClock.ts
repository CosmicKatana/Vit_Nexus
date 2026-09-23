import { useState, useEffect } from 'react';

export interface LiveClockState {
  now: Date;
  timeFormatted12: string;
  timeFormatted24: string;
  dateFormatted: string;
  weekdayFormatted: string;
  currentMinutes: number;
}

export function useLiveClock(): LiveClockState {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // 1-second interval keeps countdowns razor sharp without lag
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Format in IST (Asia/Kolkata)
  const timeFormatted12 = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const timeFormatted24 = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateFormatted = now.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const weekdayFormatted = now.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
  });

  return {
    now,
    timeFormatted12,
    timeFormatted24,
    dateFormatted,
    weekdayFormatted,
    currentMinutes,
  };
}
