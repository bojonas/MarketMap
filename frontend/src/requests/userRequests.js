import { axiosInstance } from "./axiosInstance";

export async function createUser(username, email, password, permission) {
  if (!username || !email || !password || !permission) {
    console.error('Invalid parameters');
    return;
  }

  const data = {
    username: username,
    email: email,
    password: password,
    permission: permission
  };

  try {
    const response = await axiosInstance.post('/post_users', data);
    console.log('User created successfully:', response.data);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}