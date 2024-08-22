import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Make sure this URL is correct
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
