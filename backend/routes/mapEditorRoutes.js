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

        return { message: 'Map updated successfully' };
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


// logic for endpoint /put_map_layouts
/*async function putMapLayouts(user_id, layout, postgres_pool) {
    try {
        const market_id = await getMarketId(user_id, postgres_pool);

        let cellsToDelete = [];
        for (const row of layout) {
            for (const cell of row) {
                if (cell.type === 'empty') {
                    cellsToDelete.push(cell.coordinates);
                    continue;
                } 

                const cell_type_id = await getCellTypeId(cell.type, postgres_pool);
                const query = `
                    INSERT INTO market_map.cells (coordinates, cell_type_id, market_id)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (coordinates, market_id)
                    DO UPDATE SET cell_type_id = $2
                    WHERE cells.coordinates = $1 
                    AND cells.market_id = $3;`;

                await postgres_pool.query(query, [cell.coordinates, cell_type_id, market_id]);
            }
        }

        // batch delete cells
        if (cellsToDelete.length > 0) {
            const query = `
                DELETE FROM market_map.cells
                WHERE coordinates = ANY($1::text[]) AND market_id = $2;`;

            await postgres_pool.query(query, [cellsToDelete, market_id]);
        }

        return { message: 'Map updated successfully' };
    } catch (error) {
        console.error('Error updating map:', error);
    }
}

async function getCellTypeId(type, postgres_pool) {
    try {
        let cell_type_id;
        let query = `
            SELECT cell_type_id 
            FROM market_map.cell_types
            WHERE type = $1;`;

        let result = await postgres_pool.query(query, [type]);

        if (result.rows.length > 0) {
            cell_type_id = result.rows[0].cell_type_id;
        } else {
            // add new cell type if not exist
            query = `
                INSERT INTO market_map.cell_types (type) 
                VALUES ($1) 
                RETURNING cell_type_id;`;

            result = await postgres_pool.query(query, [type]);
            cell_type_id = result.rows[0].cell_type_id;
        }
        return cell_type_id;
    } catch (error) {
        console.error('Error querying or inserting cell type:', error);
    }
}

// logic for endpoint /get_map_layouts
async function getMapLayouts(user_id, postgres_pool) {
    try {
        const market_id = await getMarketId(user_id, postgres_pool);

        const query = `
            SELECT coordinates, type
            FROM market_map.cells c
            JOIN market_map.cell_types ct
            ON c.cell_type_id = ct.cell_type_id
            WHERE market_id = $1;`;

        const result = await postgres_pool.query(query, [market_id]);
        return transformLayout(result.rows);
    } catch (error) {
        console.error('Error querying map layout:', error);
    }
}*/

module.exports = { putMapLayouts, getMapLayouts }