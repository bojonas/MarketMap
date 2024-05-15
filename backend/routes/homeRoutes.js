// logic for endpoint /get_markets
async function getMarkets(postgres_pool) {
    try {
        const query = `
            SELECT *
            FROM market_map.markets;`;

        const result = await postgres_pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error querying map layout:', error);
    }
}


module.exports = { getMarkets }