import { Response } from "@/types/axios.types";
import { api } from "@/services/axios";

class CrudService<T> {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Response<T[]>> {
    return api
      .get(this.baseUrl)
      .then((result) => ({
        success: true,
        data: result.data,
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async getById(id: number): Promise<Response<T>> {
    return api
      .get(`${this.baseUrl}/${id}`)
      .then((result) => ({
        success: true,
        data: result.data,
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async save(entity: T): Promise<Response<T>> {
    return api
      .post(this.baseUrl, JSON.stringify(entity))
      .then((result) => ({
        success: true,
        data: result.data,
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async update(id: number, entity: T): Promise<Response<T>> {
    return api
      .put(`${this.baseUrl}/${id}`, JSON.stringify(entity))
      .then((result) => ({
        success: true,
        data: result.data,
      }))
      .catch((error) => ({
        success: false,
        data: error.message,
      }));
  }

  async delete(id: number): Promise<Response<T>> {
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
