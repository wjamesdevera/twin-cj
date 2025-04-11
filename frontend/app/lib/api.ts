import { z } from "zod";
import API from "../api";
import { feedbackSchema } from "../feedback/[referenceCode]/form";

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

// Manage User API
export const login = async (data: LoginData) =>
  API.post("/api/auth/login", data);
export const logout = async () => API.get("/api/auth/logout");
export const registerAccount = async (data: RegisterData) =>
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
export const getRefreshToken = async () => API.get("/api/auth/refresh");
export const verifyEmail = async (code: string) =>
  API.get(`/api/auth/email/verify/${code}`);

// Manage Feedback
export const sendFeedback = async (data: SendFeedbackData) =>
  API.post("/api/feedbacks", data);

// Cabins API
export const createCabin = async (data: FormData) =>
  API.post("/api/services/cabins", data);
export const getCabins = async () => API.get("/api/services/cabins");
export const multiDeleteCabin = async (ids: string) =>
  API.delete(`/api/services/cabins?ids=${ids}`);
export const deleteCabin = async (id: number) =>
  API.delete(`/api/services/cabins/${id}`);
export const updateCabin = async (id: string, data: FormData) =>
  API.put(`/api/services/cabins/${id}`, data);
export const getCabin = async (id: number) =>
  API.get(`/api/services/cabins/${id}`);

// Day Tour API
export const createDayTour = async (data: FormData) =>
  API.post(`/api/services/day-tours`, data);
export const getDayTours = async () => API.get("/api/services/day-tours");
export const getDayTour = async (id: number) =>
  API.get(`/api/services/day-tours/${id}`);
export const updateDayTour = async (id: string, data: FormData) =>
  API.put(`/api/services/day-tours/${id}`, data);
export const deleteDayTour = async (id: number) =>
  API.delete(`/api/services/day-tours/${id}`);
export const multiDeleteDayTour = async (ids: string) =>
  API.delete(`/api/services/cabins?ids=${ids}`);

type AdditionalFeeType = {
  id: number;
  type: string;
  description: string;
  amount: number;
};
// Additional Fee API
export const createAdditionalFee = async (data: FormData) =>
  API.post(`/api/services/additional-fees`, data);
export const getAdditionalFees = async () =>
  API.get<{ additionalFees: AdditionalFeeType[] }>(
    "/api/services/additional-fees"
  );
export const getAdditionalFeeById = async (id: number) =>
  API.get(`/api/services/additional-fees/${id}`);
export const updateAdditionalFee = async (id: string, data: FormData) =>
  API.put(`/api/services/additional-fees/${id}`, data);
export const deleteAdditionalFee = async (id: number) =>
  API.delete(`/api/services/additional-fees/${id}`);

type ServiceCategory = {
  id: number;
  categoryId: number;
};

type Service = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  serviceCategoryId: number;
  serviceCategory: ServiceCategory;
};

type BookingService = {
  service: Service;
};

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

type Transaction = {
  id: string;
  proofOfPaymentImageUrl: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export type BookingResponse = {
  id: number;
  referenceCode: string;
  checkIn: string;
  checkOut: string;
  totalPax: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  services: BookingService[];
  customer: Customer;
  bookingStatus: string;
  transaction: Transaction;
};

// Booking API
export const getBookingById = async (id: string) =>
  API.get<BookingResponse>(`/api/bookings/${id}`);

type BookingStatus = {
  id?: number;
  name?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};
// Booking Status API

export const getBookingStatus = async () =>
  API.get<BookingStatus[]>("/api/bookings/statuses");

export const editBookingStatus = async (
  referenceCode: string,
  bookingStatus: { bookingStatus: string }
) => API.patch(`/api/bookings/status/${referenceCode}`, bookingStatus);

type ICategory = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type IServiceCategory = {
  id: number;
  categoryId: number;
  category: ICategory;
};

type IService = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  serviceCategoryId: number;
  serviceCategory: IServiceCategory;
};

type ICustomer = {
  id: number;
  personalDetailId: string;
  createdAt: string;
  updatedAt: string;
};

type IBookingStatus = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type ITransaction = {
  id: string;
  proofOfPaymentImageUrl: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  paymentAccountId: number;
};

type IBookingResponse = {
  id: number;
  referenceCode: string;
  checkIn: string;
  checkOut: string;
  totalPax: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: number;
  bookingStatusId: number;
  transactionId: string;
  customer: ICustomer;
  bookingStatus: IBookingStatus;
  services: IService[];
  transaction: ITransaction;
};

export const getBookingStatuses = async (referenceCode: string) =>
  API.get<IBookingResponse>(`/api/bookings/status/${referenceCode}`);

export const getFeedbacks = async () => API.get("/api/feedbacks/?limit=3");

type SendFeedbackSchema = z.infer<typeof feedbackSchema>;

export const sendFeedbacks = async (data: SendFeedbackSchema) =>
  API.post("/api/feedbacks", data);
export const getBooking = async () =>
  API.get<BookingResponse[]>(`/api/bookings/`);
