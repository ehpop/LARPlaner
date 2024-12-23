import { parseAbsolute } from "@internationalized/date";

import { IEvent, IEventGetDTO, IEventPostDTO } from "@/types/event.types";

export function convertGetDtoToEvent(dto: IEventGetDTO): IEvent {
  return { ...dto, date: parseAbsolute(dto.date, "CET") } as IEvent;
}

export function convertEventToPostDto(event: IEvent): IEventPostDTO {
  return { ...event, date: event.date.toAbsoluteString() } as IEventPostDTO;
}
