import axios from "axios";

export const options = {
  baseURL: process.env.API_ORIGIN || "http://localhost:8080",
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

export default API;
