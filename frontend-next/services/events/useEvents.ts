import {
  convertEventToPostDto,
  convertGetDtoToEvent,
} from "@/services/converter/events-converter";
import { createCrudHooks } from "@/services/generic/generic-hook-factory";
import {
  IEventGetDTO,
  IEventPersisted,
  IEventPostDTO,
} from "@/types/event.types";

const eventsConfig = {
  entityName: "events",
  baseUrl: "/events",
  convertGetDtoToEntity: convertGetDtoToEvent,
  convertEntityToPostDto: convertEventToPostDto,
};

const eventsHook = createCrudHooks<
  IEventPersisted,
  IEventGetDTO,
  IEventPostDTO
>(eventsConfig);

export const useEvents = eventsHook.useGetAll;
export const useEvent = eventsHook.useGetById;
export const useCreateEvent = eventsHook.useCreate;
export const useUpdateEvent = eventsHook.useUpdate;
export const useDeleteEvent = eventsHook.useDelete;
export const eventsQueryKeys = eventsHook.queryKeys;
