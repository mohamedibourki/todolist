import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiService {
  static async get(endpoint: string) {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  }

  static async post(endpoint: string, name: string) {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
      name,
    });
    return response.data;
  }

  static async update(endpoint: string, name?: string, completed?: boolean) {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, {
      name,
      completed,
    });
    return response.data;
  }

  static async delete(endpoint: string) {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`);
    return response.status === 200;
  }
}
