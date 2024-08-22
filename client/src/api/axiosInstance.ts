import axios from 'axios';


// Access the environment variable for the base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use VITE_ prefix for environment variables
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
