// api/axiosClient.js
import axios from "axios";
import queryString from "query-string";

// Set up default config for HTTP requests
const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for the API
  headers: {
    "content-type": "application/json", // Default header for JSON data
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  // Handle token here (if needed for auth)
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data; // return only response data
    }
    return response;
  },
  (error) => {
    // Handle errors globally (e.g., unauthorized, internal server errors)
    throw error;
  }
);

export default axiosClient;
