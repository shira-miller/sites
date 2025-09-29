const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
let CounrtySchema = new mongoose.Schema({
    name: { type: String, required: true },
    capital: { type: String, required: true },
    pop: { type: Number, required: true },
    img: { type: String, required: true },
    date_created: { type: Date, default: Date.now() },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
})
exports.CountryModel = mongoose.model("countries", CounrtySchema);

exports.validCountry = (country) => {
    const schema = joi.object({
        name: joi.string().min(2).max(99).required(),
        capital: joi.string().min(2).max(9).required(),
        pop: joi.number(),
        img: joi.string().min(2).max(99).required()
    });
    return schema.validate(country);
}

