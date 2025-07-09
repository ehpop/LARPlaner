import { Response, SuccessResponse } from "@/types/axios.types";
import { api } from "@/services/axios";
import { IGetDTO, IPostDTO } from "@/types/dto.types";

class CrudService<E, G extends IGetDTO, P extends IPostDTO> {
  protected baseUrl: string;
  protected readonly convertGetDtoToEntity: (dto: G) => E;
  protected readonly convertEntityToPostDto: (entity: E) => P;

  constructor(
    baseUrl: string,
    convertGetDtoToEntity: (dto: G) => E,
    convertEntityToPostDto: (entity: E) => P,
  ) {
    this.baseUrl = baseUrl;
    this.convertGetDtoToEntity = convertGetDtoToEntity;
    this.convertEntityToPostDto = convertEntityToPostDto;
  }

  async getAll(): Promise<Response<E[]>> {
    return api
      .get(this.baseUrl)
      .then((result) => ({
        success: true,
        data: result.data.map((dto: G) => this.convertGetDtoToEntity(dto)),
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async getById(id: string): Promise<Response<E>> {
    return api
      .get(`${this.baseUrl}/${id}`)
      .then(
        (result) =>
          ({
            success: true,
            data: this.convertGetDtoToEntity(result.data),
          }) as SuccessResponse<E>,
      )
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async save(entity: E): Promise<Response<E>> {
    const postDto = this.convertEntityToPostDto(entity);

    return api
      .post(this.baseUrl, postDto)
      .then(
        (result) =>
          ({
            success: true,
            data: this.convertGetDtoToEntity(result.data),
          }) as SuccessResponse<E>,
      )
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async update(id: string, entity: E): Promise<Response<E>> {
    const postDto = this.convertEntityToPostDto(entity);

    return api
      .put(`${this.baseUrl}/${id}`, postDto)
      .then(
        (result) =>
          ({
            success: true,
            data: this.convertGetDtoToEntity(result.data),
          }) as SuccessResponse<E>,
      )
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async delete(id: string): Promise<Response<E>> {
    return api
      .delete(`${this.baseUrl}/${id}`)
      .then((result) => ({
        success: true,
        data: result.data,
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }
}

export default CrudService;
