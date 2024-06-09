import { axiosInstance } from "./axiosInstance";

// request to /put_map_layouts
export async function requestUpdateMapLayout(user_id, layout) {
  if (!user_id || !layout) return console.error('Invalid parameters');

  const data = {
    user_id: user_id,
    layout: layout
  };

  try {
    const response = await axiosInstance.put('/put_map_layouts', data);
    return response.data.message
  } catch (error) {
    console.error('Error updating map layouts:', error);
  }
}

// request to /put_market_zones
export async function requestUpdateMarketZones(user_id, zones) {
  if (!user_id || !zones) return console.error('Invalid parameters');

  const data = {
    user_id: user_id,
    zones: zones
  };

  try {
    const response = await axiosInstance.put('/put_market_zones', data);
    return response.data.message
  } catch (error) {
    console.error('Error updating market zones:', error);
  }
}

// request to /get_my_markets
export async function requestGetMyMarket(user_id) {
  if (!user_id) {
    return console.error('Invalid parameters');
  }

  const data = {
    user_id: user_id
  };

  try {
    const response = await axiosInstance.post('/get_my_markets', data);
    return response.data
  } catch (error) {
    console.error('Error getting my market:', error);
  }
}

// request to /get_market_zones
export async function requestGetMarketZones(market_id) {
  if (!market_id) {
    return console.error('Invalid parameters');
  }

  const data = {
    market_id: market_id
  };

  try {
    const response = await axiosInstance.post('/get_market_zones', data);
    return response.data
  } catch (error) {
    console.error('Error getting market zones:', error);
  }
}