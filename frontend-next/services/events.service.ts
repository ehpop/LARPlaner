import CrudService from "@/services/crud.service";
import { IEvent, IEventGetDTO, IEventPostDTO } from "@/types/event.types";
import {
  convertEventToPostDto,
  convertGetDtoToEvent,
} from "@/services/converter/events-converter";

class EventsService extends CrudService<IEvent, IEventGetDTO, IEventPostDTO> {
  constructor() {
    super("/events", convertGetDtoToEvent, convertEventToPostDto);
  }
}

export default new EventsService();
