const jwt = require("jsonwebtoken");
const config = require("../config/secret");
exports.auth = async (req, res, next) => {
    const token = req.header("x-api-key");
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try {
        const tokenData = jwt.verify(token, config.tokenSecret);
        req.tokenData = tokenData;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
}
exports.authAdmin = async (req, res, next) => {
    const token = req.header("x-api-key");
    if (!token) return res.status(401).json({msg:"Access denied. No token provided."});
    try {
        const tokenData = jwt.verify(token, config.tokenSecret);
        if (tokenData.role !== "admin")
            res.status(403).json({ msg: "token invalid for admin" })
        req.tokenData = tokenData;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
}