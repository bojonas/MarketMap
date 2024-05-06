//const transformLayout = require('../helper/transformLayout')

// get market id with user id
async function getMarketId(user_id, postgres_pool) {
    const query = `
        SELECT market_id 
        FROM market_map.users_markets
        WHERE user_id = $1;`;

    const { rows } = await postgres_pool.query(query, [user_id]);
    return rows[0]?.market_id;
}

// logic for endpoint /put_map_layouts
async function putMapLayouts(user_id, layout, postgres_pool) {
    const client = await postgres_pool.connect();

    try {
        await client.query('BEGIN;');

        const market_id = await getMarketId(user_id, client);
        if (!market_id) {
            throw new Error('Market ID not found');
        }

        const query = `
            UPDATE market_map.markets
            SET map_layout = $1
            WHERE market_id = $2;`;

        await client.query(query, [JSON.stringify(layout), market_id]);

        await client.query('COMMIT;');

        return { message: 'Saved' };
    } catch (error) {
        await client.query('ROLLBACK;');
        console.error('Error updating map:', error);
    } finally {
        client.release();
    }
}

// logic for endpoint /get_map_layouts
async function getMapLayouts(user_id, postgres_pool) {
    try {
        const query = `
            SELECT m.map_layout
            FROM market_map.markets m
            JOIN market_map.users_markets um ON m.market_id = um.market_id
            WHERE um.user_id = $1;`;

        const result = await postgres_pool.query(query, [user_id]);
        return result.rows[0]?.map_layout;
    } catch (error) {
        console.error('Error querying map layout:', error);
    }
}

module.exports = { putMapLayouts, getMapLayouts }