import { useEffect, useState } from 'react';

/**
 * A live IST clock (HH:MM:SS). Shared by the Hero status panel and the Footer
 * so the formatting lives in one place. Ticks once a second and pauses while
 * the tab is hidden.
 */
export function useClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    }).format(new Date());

  const [time, setTime] = useState(fmt);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!document.hidden) setTime(fmt());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}
