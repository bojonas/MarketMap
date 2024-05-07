import { axiosInstance } from "./axiosInstance";

// request to /post_users
export async function requestCreateUser(username, email, password, permission) {
  if (!username || !email || !password || !permission) {
    return console.error('Invalid parameters');
  }

  const data = {
    username: username,
    email: email,
    password: password,
    permission: permission
  };

  try {
    const response = await axiosInstance.post('/post_users', data);
    return response.data.user_id
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// request to /get_permissions
export async function requestGetPermission(user_id) {
  if (!user_id) {
    return console.error('Invalid parameters');
  }

  const data = {
   user_id: user_id
  };

  try {
    const response = await axiosInstance.post('/get_permissions', data);
    return response.data.permission;
  } catch (error) {
    console.error('Error querying permission:', error);
  }
}

//request to /check_credentials
export async function requestCheckCredentials(username, password) {
  if (!username || !password) {
    return console.error('Invalid parameters');
  }

  const data = {
   username: username,
   password: password
  };

  try {
    const response = await axiosInstance.post('/check_credentials', data);
    return response.data;
  } catch (error) {
    console.error('Error querying permission:', error);
  }
}

