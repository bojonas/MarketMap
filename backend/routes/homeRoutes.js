// logic for endpoint /get_markets
async function getMarkets(postgres_pool) {
    try {
        const query = `
            SELECT *
            FROM market_map.markets;`;

        const result = await postgres_pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error querying markets:', error);
    }
}

async function getProducts(postgres_pool) {
    try {
        const query = `
            SELECT product_id, product_name_en, brand_name, category_en, type_en, image_url
            FROM market_map.products p
            JOIN market_map.brands b ON p.brand_id = b.brand_id
            JOIN market_map.categories c ON p.category_id = c.category_id
            JOIN market_map.types t ON p.type_id = t.type_id
            ORDER BY product_id;`;

        const result = await postgres_pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error querying products:', error);
    }
}


module.exports = { getMarkets, getProducts }