import { axiosInstance } from "./axiosInstance";

// request to /get_markets
export async function requestGetMarkets() {
  try {
    const response = await axiosInstance.get('/get_markets');
    return response.data
  } catch (error) {
    console.error('Error getting markets:', error);
  }
}

// request to /get_products
export async function requestGetProducts() {
  try {
    const response = await axiosInstance.get('/get_products');
    return response.data
  } catch (error) {
    console.error('Error getting products:', error);
  }
}

// request to /put_histories
export async function requestUpdateHistory(timestamp, user_id, market_id) {
  if (!timestamp || !user_id || !market_id) return console.error('Invalid parameters');

  const data = {
    timestamp: timestamp,
    user_id: user_id,
    market_id: market_id
  }
  
  try {
    const response = await axiosInstance.put('/put_histories', data);
    return response.data
  } catch (error) {
    console.error('Error updating history:', error);
  }
}

// request to /get_histories
export async function requestGetHistory(user_id) {
  if (!user_id) return console.error('Invalid parameters');

  const data = {
    user_id: user_id
  }
  
  try {
    const response = await axiosInstance.post('/get_histories', data);
    return response.data
  } catch (error) {
    console.error('Error getting history:', error);
  }
}

// request to /delete_histories
export async function requestRemoveHistory(user_id, market_id) {
  if (!user_id || !market_id) return console.error('Invalid parameters');

  const data = {
    user_id: user_id,
    market_id: market_id
  }

  try {
    const response = await axiosInstance.post('/delete_histories', data);
    return response.data
  } catch (error) {
    console.error('Error removing history:', error);
  }
}

// request to /post_shopping_carts
export async function requestPostShoppingCart(cart_name, user_id, products) {
  if (!user_id || !products) return console.error('Invalid parameters');

  const data = {
    cart_name: cart_name || '',
    user_id: user_id,
    products: products
  }
  
  try {
    const response = await axiosInstance.post('/post_shopping_carts', data);
    return response.data.cart_id
  } catch (error) {
    console.error('Error posting shopping cart:', error);
  }
}

// request to /put_shopping_carts
export async function requestUpdateShoppingCart(cart_id, cart_name, products) {
  if (!cart_id) return console.error('Invalid parameters');

  let data = {
    cart_id: cart_id,
    products: products || []
  }
  if (cart_name || cart_name === '') data.cart_name = cart_name;

  try {
    const response = await axiosInstance.put('/put_shopping_carts', data);
    return response.data
  } catch (error) {
    console.error('Error updating shopping cart:', error);
  }
}

// request to /delete_shopping_carts
export async function requestRemoveShoppingCart(cart_id) {
  if (!cart_id) return console.error('Invalid parameters');

  const data = {
    cart_id: cart_id,
  }

  try {
    const response = await axiosInstance.post('/delete_shopping_carts', data);
    return response.data
  } catch (error) {
    console.error('Error removing shopping cart:', error);
  }
}

// request to /get_shopping_carts
export async function requestGetShoppingCarts(user_id) {
  if (!user_id) return console.error('Invalid parameters');

  const data = {
    user_id: user_id
  }

  try {
    const response = await axiosInstance.post('/get_shopping_carts', data);
    return response.data
  } catch (error) {
    console.error('Error getting shopping carts:', error);
  }
}

// request to /get_paths
export async function requestFindPath(layout, start, end, waypoints) {
  if (
    !layout || 
    !start || 
    !end || 
    !waypoints ||
    (start.length > 0 && (start[0] >= layout.length || start[1] >= layout[0].length)) ||
    (end.length > 0 && (end[0] >= layout.length || end[1] >= layout[0].length))
  ) return console.error('Invalid parameters');

  const data = {
    layout: layout,
    start: start,
    end: end,
    waypoints: waypoints
  }

  try {
    const response = await axiosInstance.post('/get_paths', data);
    return response.data
  } catch (error) {
    console.error('Error getting find path:', error);
  }
}