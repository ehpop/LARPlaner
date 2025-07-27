import { parseAbsolute } from "@internationalized/date";

import {
  IEvent,
  IEventGetDTO,
  IEventPersisted,
  IEventPostDTO,
} from "@/types/event.types";

export function convertGetDtoToEvent(dto: IEventGetDTO): IEventPersisted {
  return { ...dto, date: parseAbsolute(dto.date, "CET") } as IEventPersisted;
}

export function convertEventToPostDto(event: IEvent): IEventPostDTO {
  return { ...event, date: event.date.toAbsoluteString() } as IEventPostDTO;
}
