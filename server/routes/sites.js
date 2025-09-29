const express = require("express");
const { SiteModel, validateSite } = require("../models/siteModel");
// const { route } = require(".");
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = Math.min(20, parseInt(req.query.perPage)) || 4;
    let page = parseInt(req.query.page) || 1;
    let sort = req.query.sort;
    let reverse = req.query.reverse === "yes" ? 1 : -1;
    try {
        const totalSites = await SiteModel.countDocuments();
        const sites = await SiteModel
            .find()
            .sort({ [sort]: reverse })
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.json({sites, totalSites});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const site = await SiteModel.findById(req.params.id);
        if (!site) return res.status(404).send("Site not found");
        res.json(site);
    } catch (err) {
        res.status(400).send("Invalid ID");
    }
});

router.post("/", async (req, res) => {
    const { error } = validateSite(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newSite = new SiteModel(req.body);
    await newSite.save();
    res.json(newSite);
});

router.put("/:id", async (req, res) => {
    const { error } = validateSite(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const updatedSite = await SiteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSite) return res.status(404).send("Site not found");
        res.json(updatedSite);
    } catch (err) {
        res.status(400).send("Invalid ID");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedSite = await SiteModel.findByIdAndDelete(req.params.id);
        if (!deletedSite) return res.status(404).send("Site not found");
        res.json({ message: "Site deleted" });
    } catch (err) {
        res.status(400).send("Invalid ID");
    }
});

module.exports = router;
