import { z } from "zod";

import { zonedDateTimeString } from "./zod-date-utils";

export const AppliedTagApiResponseSchema = z.object({
  id: z.string(),
  tag: z.object({
    id: z.string(),
    value: z.string(),
    isUnique: z.boolean().optional(),
    expiresAfterMinutes: z.number().optional(),
  }),
  userEmail: z.string(),
  userID: z.string(),
  appliedToUserAt: z.string(),
});

export const AppliedTagSchema = AppliedTagApiResponseSchema.extend({
  appliedToUserAt: zonedDateTimeString,
});

export type IAppliedTagFromDTO = z.infer<typeof AppliedTagSchema>;

export function mapAppliedTag(dto: unknown): IAppliedTagFromDTO {
  return AppliedTagSchema.parse(dto);
}
