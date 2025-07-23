import { useEffect, useState } from "react";
import { getLocalTimeZone, now, ZonedDateTime } from "@internationalized/date";

/**
 * A custom React hook that provides the current time, updated at a specified interval.
 * @param updateInterval The interval in milliseconds at which to update the time. Defaults to 1000ms (1 second).
 * @returns The current ZonedDateTime.
 */
export function useCurrentTime(updateInterval: number = 1000): ZonedDateTime {
  const [currentTime, setCurrentTime] = useState(() => now(getLocalTimeZone()));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(now(getLocalTimeZone()));
    }, updateInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [updateInterval]);

  return currentTime;
}
