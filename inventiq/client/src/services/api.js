import axios from "axios";

const API = axios.create({
  baseURL: "https://inventiq-backend-o3b9.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;