import axios from "axios";

import { auth } from "@/config/firebase";

const apiBaseUrl = "https://localhost:8443/api";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
