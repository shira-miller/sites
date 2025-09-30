require("dotenv").config();

module.exports = {
    userDB: process.env.USER_DB,
    passDB: process.env.PASS_DB,
    tokenSecret: process.env.TOKEN_SECRET,
    port: process.env.PORT
};