// logic for endpoint /get_markets
async function getMarkets(postgres_pool) {
    try {
        const query = `
            SELECT *
            FROM market_map.markets
            ORDER BY market_name;`;

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
            ORDER BY type_en, product_name_en;`;

        const result = await postgres_pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error querying products:', error);
    }
}

async function putHistory(timestamp, user_id, market_id, postgres_pool) {
    try { 
        const checkQuery = `
            SELECT hist_id 
            FROM market_map.histories 
            WHERE user_id = $1 AND market_id = $2;`;

        const checkResult = await postgres_pool.query(checkQuery, [user_id, market_id]);

        // when exist update
        if (checkResult.rows.length > 0) {
            const updateQuery = `
                UPDATE market_map.histories  
                SET hist_timestamp = $1
                WHERE hist_id = $2
                RETURNING hist_id;`;

            const updateResult = await postgres_pool.query(updateQuery, [timestamp, checkResult.rows[0].hist_id]);
            return updateResult.rows;
        } 

        const countQuery = `
            SELECT COUNT(*) 
            FROM market_map.histories  
            WHERE user_id = $1;`;

        const countResult = await postgres_pool.query(countQuery, [user_id]);

        // only allow up to 5 entries per user
        if (parseInt(countResult.rows[0].count) < 5) {
            const insertQuery = `
                INSERT INTO market_map.histories  (hist_timestamp, user_id, market_id)
                VALUES ($1, $2, $3)
                RETURNING hist_id;`;

            const insertResult = await postgres_pool.query(insertQuery, [timestamp, user_id, market_id]);
            return insertResult.rows;
        }

        const updateQuery = `
            UPDATE market_map.histories 
            SET hist_timestamp = $1, market_id = $2
            WHERE hist_id = (
                SELECT hist_id 
                FROM market_map.histories 
                WHERE user_id = $3 
                ORDER BY hist_timestamp ASC 
                LIMIT 1
            )
            RETURNING hist_id;`;

            const updateResult = await postgres_pool.query(updateQuery, [timestamp, market_id, user_id]);
            return updateResult.rows;
    } catch (error) {
        console.error('Error putting history:', error);
    }
}

async function getHistory(user_id, postgres_pool) {
    try {
        const query = `
            SELECT market_id, hist_timestamp
            FROM market_map.histories h
            WHERE user_id = $1
            ORDER BY hist_timestamp DESC;`;

        const result = await postgres_pool.query(query, [user_id]);
        return result.rows;
    } catch (error) {
        console.error('Error querying history:', error);
    }
}

async function deleteHistory(user_id, market_id, postgres_pool) {
    try {
        const query = `
            DELETE FROM market_map.histories
            WHERE user_id = $1
            AND market_id = $2;`;

        const result = await postgres_pool.query(query, [user_id, market_id]);
        return result.rowCount;
    } catch (error) {
        console.error('Error querying history:', error);
    }
}

async function postShoppingCart(cart_name, user_id, product_ids, postgres_pool) {
    try { 
        const query = `
            INSERT INTO market_map.shopping_carts (cart_name, user_id)
            VALUES ($1, $2)
            RETURNING cart_id;`;

        const result = await postgres_pool.query(query, [cart_name || null, user_id]);
            
        await insertProductsInCart(result.rows[0].cart_id, product_ids, postgres_pool)
        return { message: 'Shopping Cart added successfully' }
    } catch (error) {
        console.error('Error posting shopping cart:', error);
    }
}

async function putShoppingCart(cart_id, cart_name, product_ids, postgres_pool) {
    try { 
        if (cart_name) {
            const query = `
                UPDATE INTO market_map.shopping_carts (user_id)
                VALUES ($1)
                RETURNING cart_id;`;
            
            const result = await postgres_pool.query(query, [user_id]);
            return result.rows;
        } 
        
        if (product_ids.length > 0) {
            const query = `
                DELETE FROM market_map.carts_products
                WHERE cart_id = $1;`;

            await postgres_pool.query(query, [cart_id]);

            await insertProductsInCart(cart_id, product_ids, postgres_pool);
            return { message: 'Shopping Cart updated successfully' }
        }
    } catch (error) {
        console.error('Error posting shopping cart:', error);
    }
}

async function insertProductsInCart(cart_id, product_ids, postgres_pool) {
    try {
        const values = product_ids.map((id, i) => `(${cart_id}, $${i + 1})`).join(', ');
        const query = `
            INSERT INTO market_map.carts_products (cart_id, product_id)
            VALUES ${values};`;

        await postgres_pool.query(query, product_ids);
    } catch (error) {
        console.error('Error inserting products:', error);
    }
}

module.exports = { getMarkets, getProducts, putHistory, getHistory, deleteHistory, postShoppingCart, putShoppingCart }