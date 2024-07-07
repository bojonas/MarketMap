import { axiosInstance } from "./axiosInstance";

//request to /update_data
  export async function requestUpdateData(user_id, label, content, marketFlag = false) {
    if (!user_id || !label || !content) {
      return console.error('Invalid parameters');
    }
  
    const data = {
      user_id: user_id,
      label: label.toLowerCase().replace(" ", ""),
      data: content
    };
    var response;
    try {
      if(marketFlag){
        response = await axiosInstance.put('/update_market_data', data);
      }
      else{
        response = await axiosInstance.put('/update_data', data);
      }
      return response.data.message
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

    //request to /get_user
export async function requestUser(user_id) {
  if (!user_id || user_id < 1) {
    return console.error('Invalid parameters');
  }

  const data = {
    user_id: user_id
  };

  try {
    const response = await axiosInstance.post('/get_user', data);
    return response.data
  } catch (error) {
    console.error('Error getting user:', error);
  }
}

//request to get /get_market
export async function requestMarket(user_id) {
  if (!user_id || user_id < 1) {
    return console.error('Invalid parameters');
  }

  const data = {
    user_id: user_id
  };

  try {
    const response = await axiosInstance.post('/get_market', data);
    return response.data
  } catch (error) {
    console.error('Error getting market:', error);
  }
}


// request to / get_user_colors
export async function requestgetUserColor(user_id) {
  if (!user_id) {
    return console.error('Invalid parameters');
  }

  const data = {
    user_id: user_id
  };

  try {
    const response = await axiosInstance.post('/get_user_colors', data);
    return response.data
  } catch (error) {
    console.error('Error getting user:', error);
  }
};

// request to /get_market_logo
export async function requestgetMarketLogo(user_id) {
  if (!user_id) {
    return console.error('Invalid parameters');
  }

  const data = {
    user_id: user_id
  };

  try {
    const response = await axiosInstance.post('/get_market_logo', data);
    return response.data.market_image_url
  } catch (error) {
    console.error('Error getting user:', error);
  }
};

// request to /post_market_logo
export async function requestpostMarketLogo(user_id, file) {
  if (!user_id || !file) {
    return console.error('Invalid parameters');
  }

  const data = {
    user_id: user_id,
    file: file //file as binary string
  };

  try {
    const response = await axiosInstance.post('/post_market_logo', data);
    return response
  } catch (error) {
    console.error('Error getting user:', error);
  }
};
