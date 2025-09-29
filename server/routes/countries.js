const express = require("express");
const bcrypt = require("bcrypt");
const { auth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const { validCountry, CountryModel } = require("../models/countryModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ msg: "Countries work" })
});

router.get("/myCountries", auth, async (req, res) => {
    try {
        let countries = await CountryModel.find({ user_id: req.tokenData._id });
        res.json(countries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", auth, async (req, res) => {
    let validBody = validCountry(req.body);
    if (validBody.error) return res.status(400).send(validBody.error.details[0].message);
    
    try {
        let country = new CountryModel(req.body);
        country.user_id = req.tokenData._id;
        await country.save();
        res.status(201).json(country);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message });
    }
});

router.put("/:id", auth, async (req, res) => {
    let validBody = validCountry(req.body);
    if (validBody.error) return res.status(400).send(validBody.error.details[0].message);
    if(!existUser(req.tokenData._id)) return res.status(404).send("User not found");

    try {
        let country = await CountryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!country) return res.status(404).send("Country not found");
        res.json(country);
    } catch (err) {
        res.status(400).send("Invalid ID");
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        let country = await CountryModel.findByIdAndDelete(req.params.id);
        if (!country) return res.status(404).send("Country not found");
        res.json({ message: "Country deleted" });
    } catch (err) {
        res.status(400).send("Invalid ID");
    }
});

const existUser = async (user_id) => {
    const userExist=await UserModel.findById(user_id);
    if(!userExist) return false;
    return userExist;
}



module.exports = router
