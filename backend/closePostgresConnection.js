async function closePostgresConnection(pool) {
    try {
        await pool.end();
        console.log('\nConnection closed');
    } catch (error) {
        console.error('\nError closing connection', error.stack);
    }
}
module.exports = closePostgresConnection;