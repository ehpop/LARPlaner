import CrudService from "@/services/crud.service";
import { IEvent, IEventGetDTO, IEventPostDTO } from "@/types/event.types";
import {
  convertEventToPostDto,
  convertGetDtoToEvent,
} from "@/services/converter/events-converter";
import { IGameSession } from "@/types/game.types";
import { Response } from "@/types/axios.types";
import { api } from "@/services/axios";

class EventsService extends CrudService<IEvent, IEventGetDTO, IEventPostDTO> {
  constructor() {
    super("/events", convertGetDtoToEvent, convertEventToPostDto);
  }

  async getByGameId(gameId: IGameSession["id"]): Promise<Response<IEvent>> {
    return api
      .get(`/events/gameId/${gameId}`)
      .then((result) => {
        return {
          success: true,
          data: result.data,
        };
      })
      .catch((error) => {
        return {
          success: false,
          data: error.message,
        };
      });
  }

  async updateEventStatus(
    eventId: IEvent["id"],
    requestedStatus: IEvent["status"],
  ) {
    return api
      .put(`/events/${eventId}/status`, {
        status: requestedStatus.toUpperCase(),
      })
      .then((result) => {
        return {
          success: true,
          data: result.data,
        };
      })
      .catch((error) => {
        return {
          success: false,
          data: error.message,
        };
      });
  }
}

export default new EventsService();
