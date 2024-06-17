//logic for endpoint /get_color_personal

const { query } = require("express");

async function getColor(user_id,type, postgres_pool){
    var query;
    switch(type){
        case "Personal":
            query = ` SELECT user_color
                            FROM market_map.users
                            WHERE user_id = $1;`
            break;

        case "Primary":
            query = `   SELECT primary_market_color
                        FROM market_map.markets
                        WHERE market_id = ( SELECT market_id
                                    FROM market_map.users_markets
                                    INNER JOIN market_map.users u 
                                    ON u.user_id = users_markets.user_id
                                    WHERE u.user_id = $1);`
            break;

        case "Secondary":
            query = `   SELECT secondary_market_color
                        FROM market_map.markets
                        WHERE market_id = ( SELECT market_id
                                    FROM market_map.users_markets
                                    INNER JOIN market_map.users u 
                                    ON u.user_id = users_markets.user_id
                                    WHERE u.user_id = $1);`
            break;

    }

    const result = await postgres_pool.query(query, [user_id])
    const color = result.rows[0];
    //console.log(color)
    if(!color){return({color: "#000000"}); }
    
    switch(type){
        case "Personal":
            return({color: color.user_color})

        case "Primary":
            return({color: color.primary_market_color});

        case "Secondary":
            return({color: color.secondary_market_color});

    }
    

}

async function postColor(user_id, color,type, postgres_pool){
    var query;
    switch(type){
        case "Personal":
            query = `
                UPDATE market_map.users
                SET user_color = $1
                WHERE user_id = $2
            `
            break;
        case "Primary":
            query = `
                UPDATE market_map.markets
                SET primary_market_color = $1
                WHERE market_id = ( SELECT market_id
                                    FROM market_map.users_markets
                                    INNER JOIN market_map.users u on u.user_id = users_markets.user_id
                                    WHERE u.user_id = $2);`
            break;
        case "Secondary":
            query = `
                UPDATE market_map.markets
                SET secondary_market_color = $1
                WHERE market_id = ( SELECT market_id
                                    FROM market_map.users_markets
                                    INNER JOIN market_map.users u on u.user_id = users_markets.user_id
                                    WHERE u.user_id = $2);`
            break;

        default:
            console.error("Error Posting Color. Type not correct!");
            return;
    }
    
    try{
        const result = await postgres_pool.query(query,[color, user_id])
        console.log(result)
        if(result.rowCount === 1){
            return({status: true})
        }
        else{return({status: false, message: "No rows were Updated"});}
    }
    catch(error){
        console.error("Connection error posting Color. " +error)
        return;
    }
}





module.exports = {getColor, postColor}