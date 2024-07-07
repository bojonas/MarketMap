import axios from 'axios';

// base url to send requests to
export const axiosInstance = axios.create({
  baseURL: 'https://marketmap.onrender.com/'
});