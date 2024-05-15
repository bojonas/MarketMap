import { axiosInstance } from "./axiosInstance";

// request to /get_markets
export async function requestGetMarkets() {
  try {
    const response = await axiosInstance.get('/get_markets');
    return response.data
  } catch (error) {
    console.error('Error getting markets:', error);
  }
}