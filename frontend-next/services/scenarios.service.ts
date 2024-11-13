import CrudService from "@/services/crud.service";
import { IScenario } from "@/types/scenario.types";

class ScenariosService extends CrudService<IScenario> {
  constructor() {
    super("/scenarios");
  }
}

export default new ScenariosService();
