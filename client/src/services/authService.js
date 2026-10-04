import axios from "axios";

const API = axios.create({
  baseURL: "https://subtracker-9a5z.onrender.com/api",
});

export const signup = async (userData) => {
  const response = await API.post("/auth/signup", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};
