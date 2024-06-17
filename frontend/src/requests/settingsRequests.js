import { axiosInstance } from "./axiosInstance";

//request to /get_color_personal
export async function requestGetColor(user_id, type) {
    if (!user_id) {
      return console.error('Invalid parameters');
    }
  
    const data = {
      user_id: user_id,
      type: type
    };
  
    try {
      const response = await axiosInstance.post('/get_color', data);
      return response.data.color
    } catch (error) {
      console.error('Error getting personal color:', error);
    }
  }

  //request to /post_color_personal
  export async function requestPostColor(user_id, color, type) {
    if (!user_id) {
      return console.error('Invalid parameters');
    }
  
    const data = {
      user_id: user_id,
      color: color,
      type: type
    };
  
    try {
      const response = await axiosInstance.post('/post_color', data);
      return response.data.message
    } catch (error) {
      console.error('Error posting personal color:', error);
    }
  }