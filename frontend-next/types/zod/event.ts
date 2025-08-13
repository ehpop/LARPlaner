import { z } from "zod";

import { zonedDateTimeString } from "./zod-date-utils";

export const eventStatusSchema = z.enum(["historic", "active", "upcoming"]);

// --- Event DTO schema ---
export const EventGetDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  img: z.string(),
  date: z.string(),
  description: z.string(),
  status: eventStatusSchema,
  scenarioId: z.string(),
  gameSessionId: z.string().nullable(),
  assignedRoles: z.array(
    z.object({
      id: z.string(),
      scenarioRoleId: z.string(),
      assignedEmail: z.string(),
    }),
  ),
});

// --- Event Domain schema ---
export const EventSchema = EventGetDTOSchema.extend({
  date: zonedDateTimeString,
});

export type IEventFromDTO = z.infer<typeof EventSchema>;

// --- Conversion function ---
export function mapEvent(dto: unknown): IEventFromDTO {
  return EventSchema.parse(dto);
}
