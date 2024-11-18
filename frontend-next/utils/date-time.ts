import { fromDate, ZonedDateTime } from "@internationalized/date";

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

  return date.compare(fromDate(new Date(), date.timeZone)) < 0;
};
