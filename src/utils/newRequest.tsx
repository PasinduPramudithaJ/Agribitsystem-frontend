// src/utils/newRequest.js (or .ts)
import axios from "axios";

// Create an Axios instance
const newRequest = axios.create({
  baseURL: "http://localhost:8080/api", // Replace with your backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach authentication token if needed
newRequest.interceptors.request.use(
  (config) => {
    // Retrieve token from localStorage (if you're using token-based authentication)
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
newRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default newRequest;
