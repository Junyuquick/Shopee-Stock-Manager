const express = require("express");
const router = express.Router();
const path = require("path");


router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

router.get("/apple", (req, res) => {
    res.send("apple");
});

router.get("/script", (req, res) => {
    // Send the script.js file located in the 'public' directory
    res.sendFile(path.join(__dirname, "..", "public", "script.js"));
});



module.exports = router;
