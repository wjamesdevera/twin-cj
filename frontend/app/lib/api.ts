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

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  verificationCode: string;
  password: string;
};

type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
};

type EditUserData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type SendFeedbackData = {
  fullName: string;
  email: string;
  inquiryType: string;
  contactNumber: string;
  message: string;
};

type CreateCabinData = {
  minCapacity: number;
  maxCapacity: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  additionalFee?: Partial<{
    type: string;
    description: string;
    amount: number;
  }> | null;
};

type UpdateCabinData = {
  id: number;
  data: FormData;
};

export const login = async (data: LoginData) =>
  API.post("/api/auth/login", data);
export const logout = async () => API.get("/api/auth/logout");
export const register = async (data: RegisterData) =>
  API.post("/api/auth/register", data);
export const forgotPasword = async (data: ForgotPasswordData) =>
  API.post("/api/auth/password/forgot", data);
export const getUser = async () => API.get("/api/users");
export const resetPassword = async (data: ResetPasswordData) =>
  API.post("/api/auth/password/reset", data);
export const changePassword = async (data: ChangePasswordData) =>
  API.post("/api/auth/password/change", data);
export const getAllUsers = async () => API.get("/api/users/all");
export const getUserById = async (id: string) => API.get(`/api/users/${id}`);
export const deleteUser = async (id: string) => API.delete(`/api/users/${id}`);
export const editUser = async (id: string, data: EditUserData) =>
  API.put(`/api/users/${id}`, data);
export const sendFeedback = async (data: SendFeedbackData) =>
  API.post("/api/feedbacks", data);
export const getCabins = async () => API.get("/api/services/cabins");
export const multiDeleteCabin = async (ids: string) =>
  API.delete(`/api/services/cabins?ids=${ids}`);
export const deleteCabin = async (id: number) =>
  API.delete(`/api/services/cabins/${id}`);
export const createCabin = async (data: FormData) =>
  API.post("/api/services/cabins", data);
export const updateCabin = async ({ id, data }: UpdateCabinData) =>
  API.post(`/api/services/cabins/${id}`, data);
export const getCabin = async (id: number) =>
  API.get(`/api/services/cabins/${id}`);
