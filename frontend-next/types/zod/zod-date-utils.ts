import { z } from "zod";
import { getLocalTimeZone, parseAbsolute } from "@internationalized/date";

export const zonedDateTimeString = z
  .string()
  .transform((str) => parseAbsolute(str, getLocalTimeZone()));
