async function getVersion(pool) {
    try {
        const result = await pool.query('SELECT VERSION()');
        return result.rows[0].version;
    } catch (err) {
        throw new Error('Error executing query: ' + err.stack);
    }
}

const { Pool } = require('pg')
async function openPostgresConnection() {
    const getConfig = require('./getConfig');

    const pool = new Pool(getConfig('postgres'));
    try {
        console.log(await getVersion(pool));
        return pool;
    } catch (err) {
        console.error(err.message);
    }
}
module.exports = openPostgresConnection;