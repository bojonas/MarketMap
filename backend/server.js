const express = require('express'); 
const bodyParser = require('body-parser');
// import connection functions
const openPostgresConnection = require('./openPostgresConnection');
const closePostgresConnection = require('./closePostgresConnection');
// import routes
const postUser = require('./routes/userRoutes');

const app = express(); 
const PORT = 3001; 

app.use(bodyParser.json());

// server can be run with 'node server.js'
// on startup
var postgres_pool;
app.listen(PORT, async (error) => { 
    if (!error) {
        console.log('Starting Server...');
        postgres_pool = await openPostgresConnection();
    } else {
        console.error('Error while starting Server', error); 
    }
});

// on termination
process.on('SIGINT', async () => {
    await closePostgresConnection(postgres_pool);
    process.exit(0);
});

// route endpoints
app.get('/', (req, res) => {     
    res.send('Welcome to MarketMap backend'); 
});

// get permissions
app.get('/permissions', async (req, res) => {
	const result = await postgres_pool.query('SELECT permission FROM market_map.permission');
	let permissions = '';
	for (row of result.rows) {
		permissions += row.permission + ' ';
	}
	res.send(permissions);
});

// create a new user
app.post('/post_users', async (req, res) => {
	const { username, email, password, permission_id } = req.body;
	const result = await postUser(username, email, password, permission_id);
	console.log(result);
});