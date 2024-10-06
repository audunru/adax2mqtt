import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { authenticate, getNewAccessToken } from "./cache-authenticate";

export const BASE_URL = "https://api-1.adax.no/client-api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const access_token = await authenticate();
  config.headers.Authorization = `Bearer ${access_token}`;

  return config;
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await getNewAccessToken();
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default api;
