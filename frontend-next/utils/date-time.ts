import { fromDate, ZonedDateTime } from "@internationalized/date";

import { IAppliedTag } from "@/types/tags.types";

export const MINUTE = 1000 * 60;

export const setTimeOnDate = (
  date: ZonedDateTime,
  time: string,
): ZonedDateTime => {
  const [hour, minute] = !time.match(/^[0-9]{2}:[0-9]{2}$/)
    ? [0, 0]
    : time.split(":");

  return date.set({
    hour: Number(hour),
    minute: Number(minute),
  });
};

export const isValidEventDate = (date: ZonedDateTime): boolean => {
  if (
    date === undefined ||
    date.hour === undefined ||
    date.minute === undefined ||
    date.day === undefined ||
    date.month === undefined ||
    date.year === undefined
  ) {
    return true;
  }

  return date.compare(fromDate(new Date(), date.timeZone)) > 0;
};

/**
 * Returns a string representing how long ago the given date was.
 * @param date.
 */
export const getHowLongAgo = (date: Date): string => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (diff < minute) {
    return "1m";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}m`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}h`;
  }

  return `${Math.floor(diff / day)}d`;
};

/**
 * Returns a string representing the time if the date is today, otherwise the date.
 * @param date
 */
export const getTimeOrDate = (date: Date): string => {
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString();
};

export const getDateAndTime = (date: Date): string => {
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

/**
 * Checks if an applied tag has expired based on its application time and expiration duration.
 * @param appliedTag The applied tag to check.
 * @param currentTime The current time to compare against.
 * @returns {boolean} True if the tag has expired, false otherwise.
 */
export const isTagExpired = (
  appliedTag: IAppliedTag,
  currentTime: ZonedDateTime,
): boolean => {
  const { tag, appliedToUserAt } = appliedTag;

  if (!tag.expiresAfterMinutes || tag.expiresAfterMinutes <= 0) {
    return false;
  }

  const expirationTime = appliedToUserAt.add({
    minutes: tag.expiresAfterMinutes,
  });

  return expirationTime.compare(currentTime) <= 0;
};
