const mongoose = require('mongoose');
const config=require("../config/secret");
main().catch(err => console.log(err));

async function main() {
    // mongoose.set('strictQuery' , false);
    await mongoose.connect(`mongodb+srv://${config.userDB}:${config.passDB}@cluster0.a9w5hjt.mongodb.net/ATIDA2025`);
    console.log("mongo connect started");
    // use await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test'); if your database has auth enabled
}