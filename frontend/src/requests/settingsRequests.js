import { axiosInstance } from "./axiosInstance";

//request to /get_color_personal
export async function requestGetPersonalColor(user_id) {
    if (!user_id) {
      return console.error('Invalid parameters');
    }
  
    const data = {
      user_id: user_id
    };
  
    try {
      const response = await axiosInstance.post('/get_color_personal', data);
      return response.data.color
    } catch (error) {
      console.error('Error getting personal color:', error);
    }
  }

  //request to /post_color_personal
  export async function requestPostPersonalColor(user_id, color) {
    if (!user_id) {
      return console.error('Invalid parameters');
    }
  
    const data = {
      user_id: user_id,
      color: color
    };
  
    try {
      const response = await axiosInstance.post('/post_color_personal', data);
      return response.data.message
    } catch (error) {
      console.error('Error posting personal color:', error);
    }
  }