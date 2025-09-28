const mongoose = require("mongoose");
const Joi = require("joi");

const siteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    image: { type: String, required: true },
    score: { type: Number, required: true }
});

exports.SiteModel = mongoose.model("Site", siteSchema);

exports.validateSite = (site) => {
    const siteValidation = Joi.object({
        name: Joi.string().min(2).required(),
        url: Joi.string().min(5).max(200).required(),
        image: Joi.string().min(5).max(300).required(),
        score: Joi.number().min(0).max(10).required()
    });
    return siteValidation.validate(site);
}