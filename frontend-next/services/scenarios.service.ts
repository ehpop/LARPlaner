import CrudService from "@/services/crud.service";
import {
  IScenario,
  IScenarioGetDTO,
  IScenarioPostDTO,
} from "@/types/scenario.types";
import {
  convertGetDtoToScenario,
  convertScenarioToPostDto,
} from "@/services/converter/scenarios-converter";

class ScenariosService extends CrudService<
  IScenario,
  IScenarioGetDTO,
  IScenarioPostDTO
> {
  constructor() {
    super("/scenarios", convertGetDtoToScenario, convertScenarioToPostDto);
  }
}

export default new ScenariosService();
