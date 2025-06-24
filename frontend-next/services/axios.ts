import axios from "axios";

const mockApiBaseUrl = "http://localhost:3000";
const ApiBaseUrl = "http://localhost:8080/api";

//TODO Fix
export const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || mockApiBaseUrl,
  baseURL: ApiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// if (
//   process.env.NODE_ENV !== "production" ||
//   process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
// ) {
//   setupMock(api);
// }
