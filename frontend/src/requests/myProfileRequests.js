import { axiosInstance } from "./axiosInstance";

//request to /update_data
export async function requestUpdateData(username, label, content) {
    if (!username || !label || !content) {
      return console.error('Invalid parameters');
    }
  
    const data = {
      username: username,
      label: label.toLowerCase(),
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
    const response = await axiosInstance.put('/get_user', data);
    return response.data
  } catch (error) {
    console.error('Error creating user:', error);
  }
}