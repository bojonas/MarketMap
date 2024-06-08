// logic for endpoint /put_map_layouts
async function putMapLayout(user_id, layout, postgres_pool) {
    try {
        const layoutQuery = `
            UPDATE market_map.markets
            SET map_layout = $1
            WHERE market_id = (SELECT market_id FROM market_map.users_markets WHERE user_id = $2);`;

        await postgres_pool.query(layoutQuery, [JSON.stringify(layout), user_id]);
        return { message: 'Saved' };
    } catch (error) {
        console.error('Error updating map:', error);
    }
}

async function putMarketZones(user_id, zones, postgres_pool) {
    try {
        for (const zone of zones) {
            const query = `
                INSERT INTO market_zones (zone_id, zone_name, layout, position, color, market_id)
                VALUES ($1, $2, $3, $4, $5, (SELECT market_id FROM market_map.users_markets WHERE user_id = $6))
                ON CONFLICT (zone_id, market_id)
                DO UPDATE SET zone_name = $2, layout = $3, position = $4, color = $5;`;

            await postgres_pool.query(query, [zone.id, zone.name, JSON.stringify(zone.layout), JSON.stringify(zone.position), zone.color, user_id]);
        }
        return { message: 'Saved' };
    } catch (error) {
        console.error('Error updating map:', error);
    }
}


// logic for endpoint /get_my_markets
async function getMyMarket(user_id, postgres_pool) {
    try {
        const query = `
            SELECT market_name, address, postal_code, city, country, market_image_url, map_layout
            FROM market_map.markets m
            JOIN market_map.users_markets um ON m.market_id = um.market_id
            WHERE um.user_id = $1;`;

        const result = await postgres_pool.query(query, [user_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error querying map layout:', error);
    }
}

// logic for endpoint /get_market_zones
async function getMarketZones(user_id, postgres_pool) {
    try {
        const query = `
            SELECT id, name, layout, position, color
            FROM market_map.market_zones mz
            JOIN market_map.users_markets um ON mz.market_id = um.market_id
            WHERE um.user_id = $1;`;

        const result = await postgres_pool.query(query, [user_id]);
        return result.rows;
    } catch (error) {
        console.error('Error querying market zones:', error);
    }
}


module.exports = { putMapLayout, putMarketZones, getMyMarket, getMarketZones }