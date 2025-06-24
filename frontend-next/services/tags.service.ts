import CrudService from "@/services/crud.service";
import { Response } from "@/types/axios.types";
import { ITag, ITagGetDTO, ITagPostDTO } from "@/types/tags.types";
import {
  convertGetDtoToTag,
  convertTagToPostDto,
} from "@/services/converter/tag-converter";
import { api } from "@/services/axios";

class TagsService extends CrudService<ITag, ITagGetDTO, ITagPostDTO> {
  constructor() {
    super("/tags", convertGetDtoToTag, convertTagToPostDto);
  }

  async saveAll(tags: ITag[]): Promise<Response<ITagGetDTO[]>> {
    const tagDTOs = tags.map((tag) => this.convertEntityToPostDto(tag));

    return api
      .post(this.baseUrl, tagDTOs)
      .then((result) => {
        return {
          success: true,
          data: result.data.map((dto: ITagGetDTO) =>
            this.convertGetDtoToEntity(dto),
          ),
        };
      })
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }
}

export default new TagsService();
