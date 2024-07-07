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
    origin: ['http://localhost:3000']
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


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
const { getMarkets, getProducts, putHistory, getHistory, deleteHistory, postShoppingCart, putShoppingCart, getShoppingCarts, deleteShoppingCart } = require('./routes/homeRoutes');
const findPath = require('./helper/findPath');
const getStartandEnd = require('./helper/getStartandEnd');

const History = Joi.object({
    timestamp: Joi.date().iso().required(),
    user_id: Joi.number().required(),
    market_id: Joi.number().required(),
});

const UserIdMarketId = Joi.object({
    user_id: Joi.number().required(),
    market_id: Joi.number().required(),
});

const ShoppinCartPost = Joi.object({
    cart_name: Joi.string().allow('').required(),
    user_id: Joi.number().required(),
    products: Joi.array().required(),
});

const ShoppinCartPut = Joi.object({
    cart_id: Joi.number().required(),
    cart_name: Joi.string().allow(''),
    products: Joi.array(),
});

const getPath = Joi.object({
    layout: Joi.array().required(),
    start: Joi.array().required(),
    end: Joi.array().required(),
    waypoints: Joi.array().required()
});

app.get('/get_markets', async (req, res) => {
    try {
        const result = await getMarkets(postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.get('/get_products', async (req, res) => {
    try {
        const result = await getProducts(postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.put('/put_histories', async (req, res) => {
    const { error } = History.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { timestamp, user_id, market_id } = req.body;
    try {
        const result = await putHistory(timestamp, user_id, market_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/get_histories', async (req, res) => {
    const { error } = UserId.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const { user_id } = req.body;
    try {
        const result = await getHistory(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/delete_histories', async (req, res) => {
    const { error } = UserIdMarketId.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const { user_id, market_id } = req.body;
    try {
        const result = await deleteHistory(user_id, market_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/post_shopping_carts', async (req, res) => {
    const { error } = ShoppinCartPost.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { cart_name, user_id, products } = req.body;
    try {
        const result = await postShoppingCart(cart_name, user_id, products, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.put('/put_shopping_carts', async (req, res) => {
    const { error } = ShoppinCartPut.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { cart_id, cart_name, products } = req.body;

    try {
        const result = await putShoppingCart(cart_id, cart_name, products, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/delete_shopping_carts', async (req, res) => {
    const { error } = ShoppinCartPut.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const { cart_id } = req.body;
    try {
        const result = await deleteShoppingCart(cart_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/get_shopping_carts', async (req, res) => {
    const { error } = UserId.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const { user_id } = req.body;
    try {
        const result = await getShoppingCarts(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/get_paths', async (req, res) => {
    const { error } = getPath.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const { layout, start, end, waypoints } = req.body;
    const [newStart, newEnd] = getStartandEnd(layout, waypoints, start.length > 0 ? start : null, end.length > 0 ? end : null);
    try {
        const result = findPath(layout, newStart, newEnd, waypoints);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});



/**** Login Routes ****/

// import login routes
const { postUser, getPermission, checkUserLogin, checkUser, updatePassword } = require('./routes/loginRoutes');

// schemas to validate login jsons 
const User = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
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

    const { username, email, password, firstName, lastName, permission } = req.body;
    try {
      const result = await postUser(username, email, password, firstName, lastName, permission, postgres_pool);
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
const {updateData, getUser, getMarket, getUserColor, getMarketLogo, postMarketLogo} = require('./routes/myProfileRoutes')

// schemas to validate My Profile jsons 
const UpdateData = Joi.object({
    user_id: Joi.number().required(),
    label: Joi.string().required(),
    data: Joi.string().required()
})

//endpoints for My Profile
app.put('/update_data', async (req, res) => {
    const {error} = UpdateData.validate(req.body)
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id, label, data } = req.body;
    try {
        const result = await updateData(user_id, label, data, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});



app.post('/get_user', async (req, res) => {
    const {error} = UserId.validate(req.body)

    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id} = req.body;

    try {
        const result = await getUser(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/get_market', async (req, res) => {
    const {error} = UserId.validate(req.body)

    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id } = req.body;

    try {
        const result = await getMarket(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/get_user_colors', async (req, res) => {
    const {error} = UserId.validate(req.body)
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id } = req.body;
    try {
        const result = await getUserColor(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/get_market_logo', async (req, res) => {
    const {error} = UserId.validate(req.body)
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id } = req.body;
    try {
        const result = await getMarketLogo(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/post_market_logo', async (req, res) => {
    console.log("hier: angekommen")
    const { user_id, file } = req.body;
    try {
        const result = await postMarketLogo(user_id, file, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

/**** Setting Routes ****/

// import setting routes
const {getColor, postColor} = require('./routes/settingRoutes')

//schemas to validate setting routes
    //const user_id already implemented in Section Login
const UserIdColor = Joi.object({
    user_id: Joi.number().required(),
    color: Joi.string().required(),
    type: Joi.string().valid("Personal", "Primary", "Secondary").required()
});

const UserIdColorType = Joi.object({
    user_id: Joi.number().required(),
    type: Joi.string().valid("Personal", "Primary", "Secondary").required()
});

app.post('/get_color', async (req, res)=>{
    const { error } = UserIdColorType.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id, type } = req.body;

    try {
        const result = await getColor(user_id,type, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/post_color', async (req, res)=>{
    const { error } = UserIdColor.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id, color, type } = req.body;

    try {
        const result = await postColor(user_id, color,type, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});




/**** MyMarket Routes ****/

// import map editor routes
const { putMapLayout, getMyMarket, getMarketZones, putMarketZones, deleteMarketZones, updateMarketData } = require('./routes/myMarketRoutes')

// shemas to validate map editor jsons 
const Map = Joi.object({
    user_id: Joi.number().required(),
    layout: Joi.array(),
    zones: Joi.array()
});

const MarketId = Joi.object({
    market_id: Joi.number().required()
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

app.put('/put_market_zones', async (req, res) => {
    const { error } = Map.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id, zones } = req.body;
    try {
        const result = await putMarketZones(user_id, zones, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/get_my_markets', async (req, res) => {
    const { error } = UserId.validate(req.body)
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id } = req.body;
    try {
        const result = await getMyMarket(user_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
})

app.post('/get_market_zones', async (req, res) => {
    const { error } = MarketId.validate(req.body)
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { market_id } = req.body;
    try {
        const result = await getMarketZones(market_id, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
})

app.post('/delete_market_zones', async (req, res) => {
    const { error } = Map.validate(req.body);
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id, zones } = req.body;
    try {
        const result = await deleteMarketZones(user_id, zones, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.put('/update_market_data', async (req, res) => {
    const {error} = UpdateData.validate(req.body)
    if (error) {
        console.error(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { user_id, label, data } = req.body;
    try {
        const result = await updateMarketData(user_id, label, data, postgres_pool);
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});