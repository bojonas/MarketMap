//logic for endpoint /update_data
async function updateData(username, label, data, postgres_pool){
    try{
        const query = `
        UPDATE market_map.users
        SET ${label} = $1
        WHERE username = $2
        RETURNING user_id
        `
        console.log(query)
        const result = await postgres_pool.query(query,[data, username])
        return {message: "User Data updated!", user_id: result.rows[0].user_id}
    }
    catch(error){
        console.error('Error updating data:', error);
    }


}

//logic for endpoint /get_user
async function getUser(username, postgres_pool){
    try{
        const query = `
        SELECT username, email, 'Ben' as firstName, 'Roehrig' as lastName
        FROM market_map.users
        Where username = $1
        `
        const result = await postgres_pool.query(query,[username]);
        return {username: result.rows[0].username, email: result.rows[0].email, firstName: result.rows[0].firstname, lastName: result.rows[0].lastname}

    }
    catch(error){
        console.error('Error getting user data:', error);
    }
}







module.exports = {updateData, getUser}