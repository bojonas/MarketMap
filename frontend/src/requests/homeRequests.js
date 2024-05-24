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

// request to /get_products
export async function requestGetProducts() {
  try {
    const response = await axiosInstance.get('/get_products');
    return response.data
  } catch (error) {
    console.error('Error getting products:', error);
  }
}

// request to /put_histories
export async function requestUpdateHistory(timestamp, user_id, market_id) {
  if (!timestamp || !user_id || !market_id) return console.error('Invalid parameters');

  const data = {
    timestamp: timestamp,
    user_id: user_id,
    market_id: market_id
  }
  
  try {
    const response = await axiosInstance.put('/put_histories', data);
    return response.data
  } catch (error) {
    console.error('Error updating history:', error);
  }
}

// request to /get_histories
export async function requestGetHistory(user_id) {
  if (!user_id) return console.error('Invalid parameters');

  const data = {
    user_id: user_id
  }
  
  try {
    const response = await axiosInstance.post('/get_histories', data);
    return response.data
  } catch (error) {
    console.error('Error getting products:', error);
  }
}