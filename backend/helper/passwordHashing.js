const bcrypt = require('bcrypt');

// pwd hashing
async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.error(error);
    }
}

async function checkPassword(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { checkPassword, hashPassword }