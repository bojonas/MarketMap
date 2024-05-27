import jwt from 'jsonwebtoken';

const secretKey = 'ifx4ever1.2!3§4$5%6&7/8(9)0=?+lol'

async function generateToken(payload){
    const token = jwt.sign(payload, secretKey,{'expiresIn': '1h'} )
    return { token: token }
}

async function checkToken(token){
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return 'Invalid token';
        }
       return { message: 'This is the decoded data', user: decoded };
    });
}

async function getUserId(token){
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return 'Invalid token';
        }
       return { message: 'This is the user_id', user: decoded.user_id };
    });
}

async function getPermission(token){
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return 'Invalid token';
        }
       return { message: 'This is the decoded data', user: decoded.permission };
    });
}