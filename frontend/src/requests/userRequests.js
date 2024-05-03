const axios = require('axios');

export async function createUser(username, email, password, permission_id) {
  const data = {
    username: username,
    email: email,
    password: password,
    permission_id: permission_id
  };

  try {
    const response = await axios.post('http://localhost:3001/post_users', data);
    console.log('User created successfully:', response.data);
  } catch (error) {
    console.error('Error creating user:', error.response.data);
  }
}