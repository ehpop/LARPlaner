import CrudService from "@/services/crud.service";
import { IEvent } from "@/types/event.types";

class EventsService extends CrudService<IEvent> {
  constructor() {
    super("/events");
  }
}

export default new EventsService();
