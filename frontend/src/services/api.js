import axios from "axios";

const API = axios.create({
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