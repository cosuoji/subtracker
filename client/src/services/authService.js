import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const signup = async (userData) => {
  const response = await API.post("/auth/signup", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};
