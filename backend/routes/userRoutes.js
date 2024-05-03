async function postUser(username, email, password, permission, postgres_pool) {
  try {
    // get permission id 
    const permission_id = await getPermissionId(permission, postgres_pool);

    const query = `
      INSERT INTO market_map.user (username, email, password, permission_id)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id;`;

    const result = await postgres_pool.query(query, [username, email, password, permission_id]);
    const user_id = result.rows[0].user_id;
    
    return { message: 'User created successfully', user_id: user_id };
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

async function getPermissionId(permission, postgres_pool) {
  try {
    const query = `
      SELECT permission_id 
      FROM market_map.permission 
      WHERE permission = $1`;

    const result = await postgres_pool.query(query, [permission]);

    return result.rows[0].permission_id;
  } catch (error) {
    console.error('Error querying permission_id:', error);
  }
}

module.exports = postUser;