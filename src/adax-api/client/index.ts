import axios from "axios";

import { authenticate } from "./cache-authenticate";

export const BASE_URL = "https://api-1.adax.no/client-api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const access_token = await authenticate();
  config.headers.Authorization = `Bearer ${access_token}`;

  return config;
});

export default api;
