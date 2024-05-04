const getConfig = require('./getConfig');
const { Pool } = require('pg');

async function getVersion(pool) {
    try {
        const result = await pool.query('SELECT VERSION()');
        return result.rows[0].version;
    } catch (err) {
        throw new Error('Error executing query: ' + err.stack);
    }
}

async function openPostgresConnection() {
    const config = getConfig('postgres');

    const pool = new Pool(config);
    try {
        console.log(await getVersion(pool));
        return pool;
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = openPostgresConnection;