const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
// import connection functions
const openPostgresConnection = require('./openPostgresConnection');
const closePostgresConnection = require('./closePostgresConnection');
// import routes
const postUser = require('./routes/userRoutes');

const app = express(); 
const PORT = 3001; 

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(bodyParser.json());
app.use(express.json());


// create schemas to validate body
const Joi = require('joi');
const User = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  permission: Joi.string().valid('admin', 'market', 'user').required()
});

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
/**** Home Routes ****/

/**** Login Routes ****/
// create a new user
app.post('/post_users', async (req, res) => {
    const { username, email, password, permission } = req.body;
    try {
      const result = await postUser(username, email, password, permission, postgres_pool);
      res.status(201).json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// get permission with user id 
app.get('/get_permission', async (req, res) => {
    const { user_id } = req.body;
    try {
        const result = await getPermission(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

/**** MapViewer Routes ****/

/**** MapEditor Routes ****/