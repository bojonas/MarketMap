import { axiosInstance } from "./axiosInstance";

// request to /put_map_layouts
export async function requestUpdateMapLayout(user_id, layout) {
  if (!user_id || !layout) {
    return console.error('Invalid parameters');
  }

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

// request to /get_map_layouts
export async function requestGetMapLayout(user_id) {
  if (!user_id) {
    return console.error('Invalid parameters');
  }

  const data = {
    user_id: user_id
  };

  try {
    const response = await axiosInstance.post('/get_map_layouts', data);
    return response.data
  } catch (error) {
    console.error('Error getting map layouts:', error);
  }
}