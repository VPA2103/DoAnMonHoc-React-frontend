import axios from "axios";

const axiosUser = axios.create({
  baseURL: "http://localhost:8000/api",
});

axiosUser.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosUser;
