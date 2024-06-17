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

async function putMarketZones(user_id, zones, postgres_pool) {
    try {
        for (const zone of zones) {
            const query = `
                INSERT INTO market_map.market_zones (zone_id, zone_name, zone_layout, zone_position, zone_color, market_id)
                VALUES ($1, $2, $3, $4, $5, (SELECT market_id FROM market_map.users_markets WHERE user_id = $6))
                ON CONFLICT ON CONSTRAINT ref_zones_markets
                DO UPDATE SET zone_name = $2, zone_layout = $3, zone_position = $4, zone_color = $5;`;

            await postgres_pool.query(query, [zone.zone_id, zone.zone_name, JSON.stringify(zone.zone_layout), JSON.stringify(zone.zone_position), zone.zone_color, user_id]);
        }
        return { message: 'Saved' };
    } catch (error) {
        console.error('Error updating zones:', error);
    }
}


// logic for endpoint /get_my_markets
async function getMyMarket(user_id, postgres_pool) {
    try {
        const query = `
            SELECT m.market_id, market_name, address, postal_code, city, country, primary_market_color, secondary_market_color, market_image_url, map_layout
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
async function getMarketZones(market_id, postgres_pool) {
    try {
        const query = `
            SELECT zone_id, zone_name, zone_layout, zone_position, zone_color
            FROM market_map.market_zones 
            WHERE market_id = $1
            ORDER BY zone_id;`;

        const result = await postgres_pool.query(query, [market_id]);
        return result.rows;
    } catch (error) {
        console.error('Error querying market zones:', error);
    }
}

async function deleteMarketZones(user_id, zones, postgres_pool) {
    try {
        for (const zone of zones) {
            const query = `
                DELETE FROM market_map.market_zones
                WHERE zone_id = $1 AND market_id = (SELECT market_id FROM market_map.users_markets WHERE user_id = $2);`;

            await postgres_pool.query(query, [zone.zone_id, user_id]);
        }
        return { message: 'Zones deleted' };
    } catch (error) {
        console.error('Error deleting zones:', error);
    }
}

module.exports = { putMapLayout, putMarketZones, getMyMarket, getMarketZones, deleteMarketZones }