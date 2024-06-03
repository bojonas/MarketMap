//logic for endpoint /get_color_personal

async function getColorPersonal(user_id, postgres_pool){

    return({color: "#00FF29"})
}

async function postColorPersonal(user_id, color, postgres_pool){

    return({status: true})
}



module.exports = {getColorPersonal, postColorPersonal}