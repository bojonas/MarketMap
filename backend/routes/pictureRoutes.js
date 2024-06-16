async function update_market_picture(user_id, url, postgres_pool){
    try{    
        const query = `
        UPDATE market_map.markets m
        SET market_image_url = $1
        WHERE m.market_id = 
            (SELECT market_id 
            FROM market_map.users_markets 
            WHERE user_id = $2)`

        const result = await postgres_pool.query(query,[url,user_id]);
        return result.rows[0];
    }catch(error){
        console.error('Error uploading market picture:', error);
    }

}