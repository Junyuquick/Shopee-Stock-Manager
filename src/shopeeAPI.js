const express = require("express");
const router = express.Router();
const path = require("path");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const { generateShopAPIURLAndOtherData } = require("./functions.js");


router.get("/shop", async (req, res) => {
    const path = "/api/v2/shop/get_shop_info";

    //call /shopeeauth/refresh api to generate new access/refresh token and store it
    try {
        const response = await axios.get("https://quickjunyu.com/shopeeauth/refresh");
        const { access_token } = response.data;

        const { requestURL } = generateShopAPIURLAndOtherData(path, access_token)

        //calling shopee api to retrive shop info
        try {
            const response = await axios.get(requestURL);
            res.json(response.data);
        } catch (error) {
            console.log("Error fetching shopee data: ", error);
            res.send("Main API used: /shopeeapi/shopee. " + "\n" + "Failed API: /shopeeauth/refresh. " + "Error with calling shopee API: either retrieving shop info or to generate access token" + error);
        }

    } catch (error) {
        res.send("Main and Failed API used: /shopeeapi/shopee. " + "\n" + "Error with calling shopee API: either retrieving shop info" + error);
    };

})



module.exports = router;