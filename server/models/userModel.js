const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("../config/secret");
let UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    date_created: { type: Date, default: Date.now() }
})
exports.UserModel = mongoose.model("users", UserSchema);

exports.createToken = function (user) {
    let token = jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        config.tokenSecret,
        {
            expiresIn: "1h"
        }
    );
    return token;
}
exports.validUser = (user) => {
    const schema = joi.object({
        name: joi.string().min(2).max(99).required(),
        email: joi.string().min(2).max(99).required(),
        password: joi.string().min(3).max(99).required()
    });
    return schema.validate(user);
}
exports.validLogin = (user) => {
    const schema = joi.object({
        email: joi.string().min(2).max(99).required(),
        password: joi.string().min(2).max(99).required()
    });
    return schema.validate(user);
}