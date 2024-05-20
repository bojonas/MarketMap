import { axiosInstance } from "./axiosInstance";

//request to /update_data
export async function requestUpdateData(username, label, content) {
    if (!username || !label || !content) {
      return console.error('Invalid parameters');
    }
  
    const data = {
      username: username,
      label: label.toLowerCase().replace(" ", ""),
      data: content
    };
  
    try {
      const response = await axiosInstance.put('/update_data', data);
      return response.data.message
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

    //request to /get_user
export async function requestUser(user_id) {
  if (!user_id || user_id < 1) {
    return console.error('Invalid parameters');
  }

  const data = {
    user_id: user_id
  };

  try {
    const response = await axiosInstance.post('/get_user', data);
    return response.data
  } catch (error) {
    console.error('Error getting user:', error);
  }
}

//request to get /get_market
export async function requestMarket(user_id) {
  if (!user_id || user_id < 1) {
    return console.error('Invalid parameters');
  }

  const data = {
    user_id: user_id
  };

  try {
    const response = await axiosInstance.post('/get_market', data);
    return response.data
  } catch (error) {
    console.error('Error getting market:', error);
  }
}