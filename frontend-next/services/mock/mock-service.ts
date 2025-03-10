import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { uuidv4 } from "@firebase/util";

import {
  eventsList,
  mockGameSessions,
  possibleRoles,
  possibleScenarios,
} from "@/services/mock/mock-data";
import { IScenario } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";
import { IEventGetDTO } from "@/types/event.types";
import { IGameSession } from "@/types/game.types";

const scenarios: IScenario[] = possibleScenarios;
const roles: IRole[] = possibleRoles;
const events: IEventGetDTO[] = eventsList.map((event) => ({
  ...event,
  id: event.id as string,
  date: event.date.toDate().toISOString(),
}));

const scenariosUrl =
  /\/scenarios\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;
const rolesUrl =
  /\/roles\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;
const eventsUrl =
  /\/events\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;
const gameSessionsUrl =
  /\/game\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;

export default function setupMock(api: AxiosInstance) {
  const mock = new MockAdapter(api);

  setupMockScenariosApi(mock);
  setupMockRolesApi(mock);
  setupMockEventsApi(mock);
  setupMockGameSessionsApi(mock);
}

function setupMockScenariosApi(mock: MockAdapter) {
  mock.onGet("/scenarios").reply(200, scenarios);

  // Mocking the GET /scenarios/:id endpoint
  mock.onGet(scenariosUrl).reply((config) => {
    const id = config.url?.split("/").pop();
    const scenario = scenarios.find((s) => s.id === id);

    return scenario
      ? [200, scenario]
      : [404, { message: "Scenario not found" }];
  });

  // Mocking the POST /scenarios endpoint
  mock.onPost("/scenarios").reply((config) => {
    const newScenario: IScenario = JSON.parse(config.data);

    newScenario.id = uuidv4();
    scenarios.push(newScenario);

    return [201, newScenario];
  });

  // Mocking the PUT /scenarios/:id endpoint
  mock.onPut(scenariosUrl).reply((config) => {
    const id = config.url?.split("/").pop();
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
  mock.onDelete(scenariosUrl).reply((config) => {
    const id = config.url?.split("/").pop();
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
  mock.onGet(rolesUrl).reply((config) => {
    const id = config.url?.split("/").pop();
    const role = roles.find((r) => r.id === id);

    return role ? [200, role] : [404, { message: "Role not found" }];
  });

  // Mocking the POST /roles endpoint
  mock.onPost("/roles").reply((config) => {
    const newRole: IRole = JSON.parse(config.data);

    newRole.id = uuidv4();
    roles.push(newRole);

    return [201, newRole];
  });

  // Mocking the PUT /roles/:id endpoint
  mock.onPut(rolesUrl).reply((config) => {
    const id = config.url?.split("/").pop();
    const updatedRole: IRole = JSON.parse(config.data);
    const roleIndex = roles.findIndex((r) => r.id === id);

    if (roleIndex !== -1) {
      roles[roleIndex] = { ...roles[roleIndex], ...updatedRole };

      return [200, roles[roleIndex]];
    }

    return [404, { message: "Role not found" }];
  });

  // Mocking the DELETE /roles/:id endpoint
  mock.onDelete(rolesUrl).reply((config) => {
    const id = config.url?.split("/").pop();
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

  mock.onGet(eventsUrl).reply((config) => {
    const id = config.url?.split("/").pop();
    const event = events.find((e) => e.id === id);

    return event ? [200, event] : [404, { message: "Event not found" }];
  });

  // Mocking the POST /events endpoint
  mock.onPost("/events").reply((config) => {
    const newEvent = JSON.parse(config.data);

    newEvent.id = uuidv4();
    events.push(newEvent);

    return [201, newEvent];
  });

  // Mocking the DELETE /events/:id endpoint
  mock.onDelete(eventsUrl).reply((config) => {
    const id = config.url?.split("/").pop();
    const eventIndex = events.findIndex((e) => e.id === id);

    if (eventIndex !== -1) {
      const deletedEvent = events.splice(eventIndex, 1);

      return [200, deletedEvent[0]];
    }

    return [404, { message: "Event not found" }];
  });

  // Mocking the PUT /events/:id endpoint
  mock.onPut(eventsUrl).reply((config) => {
    const id = config.url?.split("/").pop();
    const updatedEvent: IEventGetDTO = JSON.parse(config.data);
    const eventIndex = events.findIndex((r) => r.id === id);

    if (eventIndex !== -1) {
      events[eventIndex] = { ...events[eventIndex], ...updatedEvent };

      return [200, events[eventIndex]];
    }

    return [404, { message: "Event not found" }];
  });
}

function setupMockGameSessionsApi(mock: MockAdapter) {
  mock.onGet("/game").reply(200, mockGameSessions);

  mock.onGet(gameSessionsUrl).reply((config) => {
    const id = config.url?.split("/").pop();

    const gameSession = mockGameSessions.find((gs) => gs.id === id);

    return gameSession
      ? [200, gameSession]
      : [404, { message: "Game session not found" }];
  });

  mock.onPost("/game").reply((config) => {
    const newGameSession = JSON.parse(config.data);

    newGameSession.id = uuidv4();
    mockGameSessions.push(newGameSession);

    return [201, newGameSession];
  });

  mock.onPut(gameSessionsUrl).reply((config) => {
    const id = config.url?.split("/").pop();
    const updatedGameSession: IGameSession = JSON.parse(config.data);
    const gameSessionIndex = mockGameSessions.findIndex((gs) => gs.id === id);

    if (gameSessionIndex !== -1) {
      mockGameSessions[gameSessionIndex] = {
        ...mockGameSessions[gameSessionIndex],
        ...updatedGameSession,
      };

      return [200, mockGameSessions[gameSessionIndex]];
    }

    return [404, { message: "Game session not found" }];
  });

  mock.onDelete(gameSessionsUrl).reply((config) => {
    const id = config.url?.split("/").pop();
    const gameSessionIndex = mockGameSessions.findIndex((gs) => gs.id === id);

    if (gameSessionIndex !== -1) {
      const deletedGameSession = mockGameSessions.splice(gameSessionIndex, 1);

      return [200, deletedGameSession[0]];
    }

    return [404, { message: "Game session not found" }];
  });
}
