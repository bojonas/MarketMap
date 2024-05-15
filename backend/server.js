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
    origin: ['http://localhost:3000', 'http://192.168.178.87:3000','http://192.168.178.136:3000']
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

// import home routes
const { getMarkets } = require('./routes/homeRoutes');

app.get('/get_markets', async (req, res) => {
    try {
        const result = await getMarkets(postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
})

/**** Login Routes ****/

// import login routes
const { postUser, getPermission, checkUserLogin, checkUser, updatePassword } = require('./routes/loginRoutes');

// schemas to validate login jsons 
const User = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    permission: Joi.string().valid('admin', 'market', 'user').required()
});

const UserId = Joi.object({
    user_id: Joi.number().required()
})

const LoginUser = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const PwUpdate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const EmailObject = Joi.object({
    email: Joi.string().email().required()
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

// check user input
app.post("/check_credentials", async (req, res)=>{
    const {error} = LoginUser.validate(req.body);
    if(error){
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    const{username, password} = req.body

    try {
        const result = await checkUserLogin(username, password, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }

})

app.post("/check_user", async (req, res)=>{
    const {error} = EmailObject.validate(req.body);
    if(error){
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    const{email} = req.body;
    try {
        const result = await checkUser(email, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }

    

})

app.post("/update_password", async (req, res)=>{
    const {error} = PwUpdate.validate(req.body);
    if(error){
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    const{email, password} = req.body;
    try {
        const result = await updatePassword(email, password, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }

    

})

/**** MyProfile Routes ****/

//import My Profile Routes
const {updateData, getUser} = require('./routes/myProfileRoutes')

// schemas to validate My Profile jsons 
const UpdateData = Joi.object({
    username: Joi.string().required(),
    label: Joi.string().required(),
    data: Joi.string().required()
})

const UserIdObject = Joi.object({
    user_id: Joi.number().required()
})

//endpoints for My Profile
app.put('/update_data', async (req, res) => {
    const {error} = UpdateData.validate(req.body)
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, label, data } = req.body;
    try {
        const result = await updateData(username, label, data, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.put('/get_user', async (req, res) => {
    const {error} = UserIdObject.validate(req.body)

    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id} = req.body;

    if (user_id === -1) {
        console.error("No valid user");
        return res.status(400).json({ error: "No valid user" });
    }

    try {
        const result = await getUser(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});





/**** MapViewer Routes ****/

/**** MapEditor Routes ****/

// import map editor routes
const { putMapLayout, getMapLayout } = require('./routes/mapEditorRoutes')

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
        const result = await putMapLayout(user_id, layout, postgres_pool);
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
        const result = await getMapLayout(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
})