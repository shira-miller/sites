const express = require("express");
const bcrypt = require("bcrypt");
const { auth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const { validUser, UserModel, validLogin, createToken } = require("../models/userModel");
const router = express.Router();

router.get("/myEmail", auth, async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.tokenData._id }, { email: 1 });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get("/myInfo", auth, async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get("/", async (req, res) => {
    res.json({ msg: "Users work" })
})

router.post("/", async (req, res) => {
    let validBody = validUser(req.body);
    if (validBody.error) return res.status(400).send(validBody.error.details[0].message);

    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "******";
        res.status(201).json(user);
    } catch (err) {
        if (err.code == 11000) {
            return res.status(400).json({ msg: "User already exists" });
        }
        console.log(err);
        res.status(500).json({ msg: err.message });
    }
});

router.post("/login", async (req, res) => {
    let validBody = validLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = await UserModel.findOne({ email: req.body.email });
        console.log(user);
        if (!user) {
            return res.status(401).json({ message: "password or email is wrong" });
        }
        console.log(req.body.password, user.password);
        let isValid = await bcrypt.compare(req.body.password, user.password);
        console.log(isValid);
        if (!isValid) {
            return res.status(401).json({ message: "password or email is wrong" });
        }
        let token = createToken(user._id);
        res.json({ token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "err", err });
    }
});

module.exports = router;