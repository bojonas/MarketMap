const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const Joi = require('joi');
// import connection functions
const openPostgresConnection = require('./connect/openPostgresConnection');
const closePostgresConnection = require('./connect/closePostgresConnection');

const app = express(); 
const PORT = 3001; 

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(bodyParser.json());
app.use(express.json());


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

// import login routes
const { postUser, getPermission } = require('./routes/loginRoutes');

// shemas to validate login jsons 
const User = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    permission: Joi.string().valid('admin', 'market', 'user').required()
});

const UserId = Joi.object({
    user_id: Joi.number().required()
})

// create a new user
app.post('/post_users', async (req, res) => {
    const { error } = User.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

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
app.post('/get_permissions', async (req, res) => {
    const { error } = UserId.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

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

// import map editor routes
const { putMapLayouts, getMapLayouts } = require('./routes/mapEditorRoutes')

// shemas to validate map editor jsons 
const Map = Joi.object({
    user_id: Joi.number().required(),
    layout: Joi.array().required()
});

app.put('/put_map_layouts', async (req, res) => {
    const { error } = Map.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id, layout } = req.body;
    try {
        const result = await putMapLayouts(user_id, layout, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/get_map_layouts', async (req, res) => {
    const { error } = UserId.validate(req.body)
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id } = req.body;
    try {
        const result = await getMapLayouts(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
})