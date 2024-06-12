//logic for endpoint /update_data
async function updateData(username, label, data, postgres_pool){
    const whiteList = ['email', 'firstname', 'lastname']; //ALWAYS ADD YOUR ROWS
    if (!whiteList.includes(label)) {
        throw new Error('Invalid column name');
    }
    try{
        const query = `
        UPDATE market_map.users
        SET ${label} = $1
        WHERE username = $2
        RETURNING user_id
        `
        
        const result = await postgres_pool.query(query,[data, username])
        return {message: "User Data updated!", user_id: result.rows[0].user_id}
    }
    catch(error){
        console.error('Error updating data:', error);
    }


}

//logic for endpoint /get_user
async function getUser(user_id, postgres_pool){
    try{
        const query = `
        SELECT username, email, firstname, lastname
        FROM market_map.users
        Where user_id = $1
        `
        const result = await postgres_pool.query(query,[user_id]);
        return {username: result.rows[0].username, email: result.rows[0].email, firstName: result.rows[0].firstname, lastName: result.rows[0].lastname}

    }
    catch(error){
        console.error('Error getting user data:', error);
    }
}

//logic for endpoint /get_market
async function getMarket(user_id, postgres_pool){
    try{
        const query = `
        SELECT markets.market_id, market_name, address, postal_code, city, country
        FROM market_map.markets
        INNER JOIN market_map.users_markets um on markets.market_id = um.market_id
        WHERE um.user_id = $1;
        `
        const result = await postgres_pool.query(query,[user_id]);
        return {market_id: result.rows[0].market_id, market_name: result.rows[0].market_name, address: result.rows[0].address, postal_code: result.rows[0].postal_code, city: result.rows[0].city, country: result.rows[0].country}

    }
    catch(error){
        console.error('Error getting user data:', error);
    }
}

//logic for endpoint /get_user_colors
async function getUserColor(user_id, postgres_pool){
    try{
        const query = `
            SELECT user_color
            FROM market_map.users
            WHERE user_id = $1;`

        const result = await postgres_pool.query(query,[user_id]);
        return result.rows[0];
    } catch(error){
        console.error('Error getting user data:', error);
    }
}

module.exports = { updateData, getUser, getMarket, getUserColor}