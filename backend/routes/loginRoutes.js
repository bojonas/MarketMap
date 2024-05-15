// logic for endpoint /post_user
async function postUser(username, email, password, permission, postgres_pool) {
  try {
    // get permission id 
    const permission_id = await getPermissionId(permission, postgres_pool);

    const query = `
      INSERT INTO market_map.users (username, email, password, permission_id)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id;`;

    const result = await postgres_pool.query(query, [username, email, password, permission_id]);
    if (!result){
      return console.error("result not found")
    }
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
      FROM market_map.permissions
      WHERE permission = $1;`;

    const result = await postgres_pool.query(query, [permission]);
    return result.rows[0].permission_id;
  } catch (error) {
    console.error('Error querying permission_id:', error);
  }
}

// logic for endpoint /get_permissions
async function getPermission(user_id, postgres_pool) {
  try {
    const query = `
      SELECT permission
      FROM market_map.permissions p
      JOIN market_map.users u 
      ON u.permission_id = p.permission_id
      WHERE user_id = $1;`;
    
    const result = await postgres_pool.query(query, [user_id]);
    const permission =  result.rows[0].permission;

    return { message:'Permission queried successfully:', permission : permission };
  } catch (error) {
    console.error('Error querying permission:', error);
  }
}

async function checkUserLogin(username, password, postgres_pool){
  try{
    const query =`
      SELECT user_id, password
      FROM market_map.users
      WHERE username = $1
    `
    const result = await postgres_pool.query(query,[username])

    if(result.rows[0]){
      if(result.rows[0].password === password){
        return {message: "User Logged in", isLoggedIn: true, user_id: result.rows[0].user_id}
      }
      return {message: 'Invalid Password', isLoggedIn: false}
    }
    return {message: 'User does not exist', isLoggedIn: false}
  }
  catch(error){
    console.error('Error checking credentials:', error);
  }
}

//logic for endpoint /check_user
async function checkUser(email, postgres_pool){
  try{
    const query = `
    SELECT email
    FROM market_map.users
  `
  const result = await postgres_pool.query(query);
  for(i=0;i<result.rowCount;i++){
    if(result.rows[i].email === email){
      return {message: true};
    };
  }
  return {message: false};
  }
  catch(error){
    console.error('Error checking email:', error);
  }
}

//logic for endpoint /update_password
async function updatePassword(email, password, postgres_pool){
  try{
    const query = `
      UPDATE market_map.users
      SET password = $1
      WHERE email = $2;
  `
    const result = await postgres_pool.query(query,[password, email]);
    return {message: "password successfully changed"}
  }
  catch(error){
    console.error('Error checking email:', error);
  }
}



module.exports = { postUser, getPermission,checkUserLogin, checkUser, updatePassword };