import { z } from "zod";

import { zonedDateTimeString } from "@/types/zod/zod-date-utils";
import { AppliedTagSchema } from "@/types/zod/tag";

export type IGameSessionFromDTO = z.infer<typeof GameSessionSchema>;

export function mapGameSession(dto: unknown): IGameSessionFromDTO {
  return GameSessionSchema.parse(dto);
}

export const GameItemStateSummarySchema = z.object({
  id: z.string(),
  gameSessionId: z.string(),
  scenarioItem: z.object({
    id: z.string(),
    scenarioId: z.string(),
    name: z.string(),
    description: z.string(),
    actions: z.array(z.any()),
  }),
  currentHolderRoleId: z.string().nullable(),
  activeTags: z.array(
    z.object({
      id: z.string().optional(),
      value: z.string(),
      isUnique: z.boolean().optional(),
      expiresAfterMinutes: z.number().optional(),
    }),
  ),
});

export const GameRoleStateSummaryApiResponseSchema = z.object({
  id: z.string(),
  gameSessionId: z.string(),
  scenarioRole: z.object({
    id: z.string(),
    role: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
    }),
    scenarioId: z.string(),
    descriptionForGM: z.string(),
    descriptionForOwner: z.string(),
    descriptionForOthers: z.string(),
  }),
  assignedEmail: z.string(),
  assignedUserID: z.string(),
  appliedTags: z.array(AppliedTagSchema),
});

export const GameSessionApiResponseSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  startTime: z.string(),
  endTime: z.string().nullable(),
  assignedRoles: z.array(GameRoleStateSummaryApiResponseSchema),
  items: z.array(GameItemStateSummarySchema),
});

export const GameSessionSchema = GameSessionApiResponseSchema.extend({
  startTime: zonedDateTimeString,
  endTime: zonedDateTimeString.nullable(),
});
