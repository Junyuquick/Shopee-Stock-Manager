const express = require("express");
const router = express.Router();
const axios = require("axios");
const {generateShopAPIURLAndOtherData, generatePublicAPIURLAndOtherData} = require("./functions.js");


//initial generatation of access and refresh tokens, and storing it in google sheet, called once a year 
//is get since no input from user, the server is req info to other api and calling them
router.get("/init", async (req, res) => {
    const code = retrieveCode();
    const urlPath = "/api/v2/auth/token/get";
    const {shop_id, partner_id, requestURL} = generatePublicAPIURLAndOtherData(urlPath);

    const body = {
        "code": code,
        "shop_id": shop_id,
        "partner_id": partner_id
    }

    try{
        const response = await axios.post(requestURL, body);
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        storeTokensInGoogleSheet(accessToken, refreshToken);

        res.send("API used: /shopeeauth/init" + "\n" + "Access token generated: " + accessToken + "\n" + " refresh token generated: " + refreshToken);

    } catch (error) {
        //good alw send error as res.send for GET req, so u can test the url in browser and see error msg
        res.send("API used: /shopeeauth/init" + "\n" + "Unable to use code to generate access/refresh token: " + error);

    };

});


//use refresh token to generate new access/refresh token, and store it in google sheet, called every 25days(refresh token valid 30days)
//it will also be called everytime you call api to count stocks, as u need a new access token
router.get("/refresh", async (req, res) => {
    const refreshToken = retrieveRefreshToken();
    
    const urlPath = "/api/v2/auth/access_token/get";

    const {requestURL, partner_id, shop_id} = generatePublicAPIURLAndOtherData(urlPath); 

    const body = {
        "refresh_token": refreshToken,
        "shop_id": shop_id,
        "partner_id": partner_id
    };

    try {
        const response = await axios.post(requestURL, body);
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        storeTokensInGoogleSheet(accessToken, refreshToken);

        const message = "API used: /shopeeauth/refresh";
        const responseBody = {
            "message": message,
            "access_token": accessToken,
            "refresh_token": refreshToken
        };
        
        res.json(responseBody);

    } catch (error) {
        res.send("API Failed: /shopeeauth/refresh" + "\n" + "Unable to use refresh token to generate new access/refresh tokens: " + error);

    };
});


//retrieve code from google sheet 
function retrieveCode() {
    const code = "647658415656674d4d4864776d634942";
    return code;
};

//store access and refresh tokens in google sheet
function storeTokensInGoogleSheet(accessToken, refreshToken) {
    return;
};

//retrieve refresh token from google sheet 4163664d686d48426a434d41784d576a 7978774d4658424b4e6f4d4b4c43524b
function retrieveRefreshToken() {
    return "4e6e6471734c76534577707275457250";
};



module.exports = router;