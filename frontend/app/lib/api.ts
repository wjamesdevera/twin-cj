import API from "../api";

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  confirmPassword: string;
};

export const login = async (data: LoginData) =>
  API.post("/api/auth/login", data);
export const logout = async () => API.get("/api/auth/logout");
export const register = async (data: RegisterData) =>
  API.post("/api/auth/register", data);
export const getUser = async () => API.get("/api/users");
