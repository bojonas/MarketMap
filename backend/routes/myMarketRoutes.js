// logic for endpoint /put_map_layouts
async function putMapLayout(user_id, layout, postgres_pool) {
    try {
        const query = `
            UPDATE market_map.markets
            SET map_layout = $1
            WHERE market_id = (SELECT market_id FROM market_map.users_markets WHERE user_id = $2);`;

        await postgres_pool.query(query, [JSON.stringify(layout), user_id]);
        return { message: 'Saved' };
    } catch (error) {
        console.error('Error updating map:', error);
    }
}

// logic for endpoint /get_my_markets
async function getMyMarket(user_id, postgres_pool) {
    try {
        const query = `
            SELECT market_name, address, postal_code, city, country, map_layout 
            FROM market_map.markets m
            JOIN market_map.users_markets um ON m.market_id = um.market_id
            WHERE um.user_id = $1;`;

        const result = await postgres_pool.query(query, [user_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error querying map layout:', error);
    }
}

module.exports = { putMapLayout, getMyMarket }