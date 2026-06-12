import { create } from "axios";

const API = create({
  baseURL: "https://rehabit-jdci.onrender.com/"
});

API.interceptors.request.use((config) => {
  const token = global.token; //later async storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
