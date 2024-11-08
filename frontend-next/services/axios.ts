import axios from "axios";

import setupMock from "@/services/mock/mock-roles-service";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

if (process.env.NODE_ENV !== "production") {
  setupMock(api);
}
