function getConfig(db='postgres') {
    require('dotenv').config();

    if (db === 'postgres') {
        return ({
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            database: process.env.POSTGRES_DATABASE,
            ssl: {
                rejectUnauthorized: false,
                ca: process.env.POSTGRES_SSL_CA,
            },
        });
    }
}
module.exports = getConfig;