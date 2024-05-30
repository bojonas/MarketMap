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

async function postShoppingCart(cart_name, user_id, products, postgres_pool) {
    try { 
        const query = `
            INSERT INTO market_map.shopping_carts (cart_name, user_id)
            VALUES ($1, $2)
            RETURNING cart_id;`;

        const result = await postgres_pool.query(query, [cart_name, user_id]);
            
        if (products.length > 0 ) await insertProductsInCart(result.rows[0].cart_id, products, postgres_pool);
        return result.rows[0];
    } catch (error) {
        console.error('Error posting shopping cart:', error);
    }
}

async function putShoppingCart(cart_id, cart_name, products, postgres_pool) {
    try { 
        if (cart_name || cart_name === '') {
            const query = `
                UPDATE  market_map.shopping_carts
                SET cart_name = ($1)
                WHERE cart_id = $2;`;
            
            await postgres_pool.query(query, [cart_name, cart_id]);
        } 
        
        if (products.length > 0) {
            const query = `
                DELETE FROM market_map.carts_products
                WHERE cart_id = $1;`;

            await postgres_pool.query(query, [cart_id]);

            await insertProductsInCart(cart_id, products, postgres_pool);
            return { message: 'Shopping Cart updated successfully' }
        }
    } catch (error) {
        console.error('Error posting shopping cart:', error);
    }
}

// helper function
async function insertProductsInCart(cart_id, products, postgres_pool) {
    try {
        const values = products.map((product, i) => `(${cart_id}, $${2*i + 1}, $${2*i + 2})`).join(', ');
        const query = `
            INSERT INTO market_map.carts_products (cart_id, product_id, product_count)
            VALUES ${values};`;

        await postgres_pool.query(query, products.flatMap(product => [product.product_id, product.product_count]));
    } catch (error) {
        console.error('Error inserting products:', error);
    }
}

async function deleteShoppingCart(cart_id, postgres_pool) {
    try {
        const query = `
            DELETE FROM market_map.shopping_carts
            WHERE cart_id = $1;`;

        const result = await postgres_pool.query(query, [cart_id]);
        return result.rowCount;
    } catch (error) {
        console.error('Error querying history:', error);
    }
}

async function getShoppingCarts(user_id, postgres_pool) {
    try {
        const query = `
            SELECT s.cart_id, cart_name, p.product_id, product_name_en, product_count
            FROM market_map.shopping_carts s
            LEFT JOIN market_map.carts_products cp ON s.cart_id = cp.cart_id
            LEFT JOIN market_map.products p ON p.product_id = cp.product_id
            WHERE user_id = $1;`;

        const result = await postgres_pool.query(query, [user_id]);

        const groupedResult = result.rows.reduce((acc, row) => {
            const key = `${row.cart_id}-${row.cart_name}`;
            if (!acc[key]) acc[key] = { cart_id: row.cart_id, cart_name: row.cart_name, products: [] };
            
            if (row.product_id) acc[key].products.push({ product_id: row.product_id, product_name_en: row.product_name_en, product_count: row.product_count });
            return acc;
        }, {});
        return Object.values(groupedResult);
    } catch (error) {
        console.error('Error querying history:', error);
    }
}

module.exports = { getMarkets, getProducts, putHistory, getHistory, deleteHistory, postShoppingCart, putShoppingCart, getShoppingCarts, deleteShoppingCart }