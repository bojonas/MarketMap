// logic for endpoint /get_map_viewers
async function getMapViewers(market_id, postgres_pool) {
    try {
        const query = `
            SELECT map_layout
            FROM market_map.markets 
            WHERE market_id = $1;`;

        const result = await postgres_pool.query(query, [market_id]);
        return result.rows[0]?.map_layout;
    } catch (error) {
        console.error('Error querying map layout:', error);
    }
}

module.exports = { getMapViewers }