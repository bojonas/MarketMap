import axios from 'axios';

// base url to send requests to
export const axiosInstance = axios.create({
  //baseURL: 'http://localhost:3001'
  baseURL: 'https://marketmap.onrender.com/'
});