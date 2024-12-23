import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import {
  eventsList,
  possibleRoles,
  possibleScenarios,
} from "@/services/mock/mock-data";
import { IScenario } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";
import { IEventGetDTO } from "@/types/event.types";

const scenarios: IScenario[] = possibleScenarios;
const roles: IRole[] = possibleRoles;
const events: IEventGetDTO[] = eventsList.map((event) => ({
  ...event,
  id: event.id as number,
  date: event.date.toDate().toISOString(),
}));

export default function setupMock(api: AxiosInstance) {
  const mock = new MockAdapter(api, { delayResponse: 1000 });

  setupMockScenariosApi(mock);
  setupMockRolesApi(mock);
  setupMockEventsApi(mock);
}

function setupMockScenariosApi(mock: MockAdapter) {
  mock.onGet("/scenarios").reply(200, scenarios);

  // Mocking the GET /scenarios/:id endpoint
  mock.onGet(/\/scenarios\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const scenario = scenarios.find((s) => s.id === id);

    return scenario
      ? [200, scenario]
      : [404, { message: "Scenario not found" }];
  });

  // Mocking the POST /scenarios endpoint
  mock.onPost("/scenarios").reply((config) => {
    const newScenario: IScenario = JSON.parse(config.data);

    newScenario.id = scenarios.length + 1;
    scenarios.push(newScenario);

    return [201, newScenario];
  });

  // Mocking the PUT /scenarios/:id endpoint
  mock.onPut(/\/scenarios\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const updatedScenario: IScenario = JSON.parse(config.data);
    const scenarioIndex = scenarios.findIndex((s) => s.id === id);

    if (scenarioIndex !== -1) {
      scenarios[scenarioIndex] = {
        ...scenarios[scenarioIndex],
        ...updatedScenario,
      };

      return [200, scenarios[scenarioIndex]];
    }

    return [404, { message: "Scenario not found" }];
  });

  // Mocking the DELETE /scenarios/:id endpoint
  mock.onDelete(/\/scenarios\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const scenarioIndex = scenarios.findIndex((s) => s.id === id);

    if (scenarioIndex !== -1) {
      const deletedScenario = scenarios.splice(scenarioIndex, 1);

      return [200, deletedScenario[0]];
    }

    return [404, { message: "Scenario not found" }];
  });
}

function setupMockRolesApi(mock: MockAdapter) {
  mock.onGet("/roles").reply(200, roles);

  // Mocking the GET /roles/:id endpoint
  mock.onGet(/\/roles\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const role = roles.find((r) => r.id === id);

    return role ? [200, role] : [404, { message: "Role not found" }];
  });

  // Mocking the POST /roles endpoint
  mock.onPost("/roles").reply((config) => {
    const newRole: IRole = JSON.parse(config.data);

    newRole.id = roles.length + 1;
    roles.push(newRole);

    return [201, newRole];
  });

  // Mocking the PUT /roles/:id endpoint
  mock.onPut(/\/roles\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const updatedRole: IRole = JSON.parse(config.data);
    const roleIndex = roles.findIndex((r) => r.id === id);

    if (roleIndex !== -1) {
      roles[roleIndex] = { ...roles[roleIndex], ...updatedRole };

      return [200, roles[roleIndex]];
    }

    return [404, { message: "Role not found" }];
  });

  // Mocking the DELETE /roles/:id endpoint
  mock.onDelete(/\/roles\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const roleIndex = roles.findIndex((r) => r.id === id);

    if (roleIndex !== -1) {
      const deletedRole = roles.splice(roleIndex, 1);

      return [200, deletedRole[0]];
    }

    return [404, { message: "Role not found" }];
  });
}

function setupMockEventsApi(mock: MockAdapter) {
  mock.onGet("/events").reply(200, events);

  mock.onGet(/\/events\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const event = events.find((e) => e.id === id);

    return event ? [200, event] : [404, { message: "Event not found" }];
  });

  // Mocking the POST /events endpoint
  mock.onPost("/events").reply((config) => {
    const newEvent = JSON.parse(config.data);

    newEvent.id = events.length + 1;
    events.push(newEvent);

    return [201, newEvent];
  });

  // Mocking the DELETE /events/:id endpoint
  mock.onDelete(/\/events\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const eventIndex = events.findIndex((e) => e.id === id);

    if (eventIndex !== -1) {
      const deletedEvent = events.splice(eventIndex, 1);

      return [200, deletedEvent[0]];
    }

    return [404, { message: "Event not found" }];
  });

  // Mocking the PUT /events/:id endpoint
  mock.onPut(/\/events\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "0", 10);
    const updatedEvent: IEventGetDTO = JSON.parse(config.data);
    const eventIndex = events.findIndex((r) => r.id === id);

    if (eventIndex !== -1) {
      events[eventIndex] = { ...events[eventIndex], ...updatedEvent };

      return [200, events[eventIndex]];
    }

    return [404, { message: "Event not found" }];
  });
}
