import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    localStorage.getItem("server") ||
    import.meta.env.VITE_SERVER ||
    "http://localhost:3000", // Set your base URL here
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("retrived token: ", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
