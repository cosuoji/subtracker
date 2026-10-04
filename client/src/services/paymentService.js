import axios from "axios";

const API = axios.create({
  baseURL: "https://subtracker-9a5z.onrender.com/api",
});

// Automatically attach JWT to authenticated requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getPayments = async () => {
  const response = await API.get("/payments");
  return response.data;
};

export const getPayment = async (id) => {
  const response = await API.get(`/payments/${id}`);
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await API.post("/payments", paymentData);
  return response.data;
};

export const updatePayment = async (id, paymentData) => {
  const response = await API.put(`/payments/${id}`, paymentData);
  return response.data;
};

export const deletePayment = async (id) => {
  const response = await API.delete(`/payments/${id}`);
  return response.data;
};

export const updatePaymentStatus = async (id, status) => {
  const response = await API.patch(`/payments/${id}/status`, {
    status,
  });
  return response.data;
};

export const markPaymentAsPaid = async (id) => {
  const response = await API.patch(`/payments/${id}/pay`);
  return response.data;
};

export const getPaymentHistory = async (id) => {
  const response = await API.get(`/payments/${id}/history`);
  return response.data;
};

export const getUpcomingPayments = async () => {
  const response = await API.get("/payments/upcoming");
  return response.data;
};
