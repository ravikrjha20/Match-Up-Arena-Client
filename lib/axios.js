import axios from "axios";

// Get both URLs from .env
console.log(import.meta.env.VITE_API_URLS);

const baseURL = import.meta.env.VITE_API_URLS;

// Detect if running on localhost or mobile (same network)
// const isLocal = window.location.hostname === "localhost";
// const baseURL = isLocal ? urls[0] : urls[1];

axios.defaults.withCredentials = true;
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;
