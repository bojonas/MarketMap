import { axiosInstance } from "./axiosInstance";

// request to /get_map_viewers
export async function requestGetMapViewers(market_id) {
    if (!market_id) {
      return console.error('Invalid parameters');
    }
  
    const data = {
      market_id: market_id
    };
  
    try {
      const response = await axiosInstance.post('/get_map_viewers', data);
      return response.data
    } catch (error) {
      console.error('Error creating user:', error);
    }
}