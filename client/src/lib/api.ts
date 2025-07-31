import { Todo } from "@/app/page";
import axios from "axios";

let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Debug: Log the API base URL in development
if (process.env.NODE_ENV === "development") {
  API_BASE_URL = "http://localhost:8001";
}

export class ApiService {
  static async get(endpoint: string) {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  }

  static async post(
    endpoint: string,
    { name, order }: { name?: string; order?: number }
  ) {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
      name,
      order,
    });
    return response.data;
  }

  static async postReorder(endpoint: string, todos: Todo[]) {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, todos);
    return response.data;
  }

  static async update(
    endpoint: string,
    { name, order, completed }: { name?: string; order?: number; completed?: boolean },
  ) {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, {
      name,
      completed,
      order,
    });
    return response.data;
  }

  static async delete(endpoint: string) {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`);
    return response.status === 200;
  }
}
