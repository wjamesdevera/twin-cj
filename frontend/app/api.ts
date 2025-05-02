import axios, { AxiosRequestConfig } from "axios";

export const options = {
  baseURL: process.env.API_ORIGIN || "https://api.twincjresort.com",
  withCredentials: true,
};

const API = axios.create(options);

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status, data } = error.response;
    return Promise.reject({ status, ...data });
  }
);

export async function get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
) {
  return API.get<T>(url, config);
}

export default API;
