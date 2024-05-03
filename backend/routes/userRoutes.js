async function postUser(username, email, password, permission_id) {
    try {
        const query = `
            INSERT INTO market_map.users (username, email, password, permission_id)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id;`;
  
        const values = [username, email, password, permission_id];
        const result = await postgres_pool.query(query, values);
    
        const user_id = result.rows[0].user_id;
        res.status(201).json({ message: 'User created successfully', user_id: user_id });
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

module.exports = postUser;