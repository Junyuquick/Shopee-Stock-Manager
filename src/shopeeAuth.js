const express = require("express");
const router = express.Router();
const axios = require("axios");
const {generateShopAPIURLAndOtherData, generatePublicAPIURLAndOtherData} = require("./functions.js");
const {InventorySheetDetails, OrderFrequencySheetDetails, getGoogleCredentials} = require("./googleAuth.js");
const {addingNewRefreshTokenToGoogleSheet} = require("./googleSheetTokenUpdate.js");


//initial generatation of access and refresh tokens, and storing it in google sheet, called once a year 
//is get since no input from user, the server is req info to other api and calling them
router.get("/init", async (req, res) => {
    const code = await retrieveCode();
    const urlPath = "/api/v2/auth/token/get";
    const {shop_id, partner_id, requestURL} = await generatePublicAPIURLAndOtherData(urlPath);

    const body = {
        "code": code,
        "shop_id": shop_id,
        "partner_id": partner_id
    };

    try{
        const response = await axios.post(requestURL, body);
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        const newBody = {
            access_token: accessToken,
            refresh_token: refreshToken
        };

        //storing new access and refresh token in google sheet
        const newResponse = await addingNewRefreshTokenToGoogleSheet(newBody);

        //logging new Code in google sheet logs
        const responseMessage = `Code Initialisation Activated: ${code}\nAccess Token: ${accessToken}\nRefresh Token: ${refreshToken}`;
        const messagePosted = {"message": responseMessage};
        const loggingResponse = await axios.post("https://quickjunyu.com/googlesheetshopeestockupdate/logging", messagePosted, {headers: {'Content-Type': 'application/json'}});
        console.log("loggingResponse: " + JSON.stringify(loggingResponse.data));


        const browserResponseBody = {
            accessToken,
            refreshToken,
            loggingResponse: loggingResponse.data
        };
        res.json(browserResponseBody);

    } catch (error) {
        //good alw send error as res.send for GET req, so u can test the url in browser and see error msg
        res.send("API used: /shopeeauth/init" + "\n" + "Unable to use code to generate access/refresh token: " + error);

    };

});


//use refresh token to generate new access/refresh token, and store it in google sheet, called every 25days(refresh token valid 30days)
//it will also be called everytime you call api to count stocks, as u need a new access token
router.get("/refresh", async (req, res) => {
    const refreshToken = await retrieveRefreshToken();

    const urlPath = "/api/v2/auth/access_token/get";

    const {requestURL, partner_id, shop_id} = await generatePublicAPIURLAndOtherData(urlPath); 

    const body = {
        "refresh_token": refreshToken,
        "shop_id": shop_id,
        "partner_id": partner_id
    };

    try {
        const response = await axios.post(requestURL, body);
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        console.log("new refresh token: " + refreshToken);  

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


//retrieve code from google sheet  4c4a584d5574496174476368445a5479
async function retrieveCode() {
    const {sheets, spreadsheetId, sheetName} = await InventorySheetDetails();
    //hard code X2
    const range = `${sheetName}!X2`;

    const request = {
        spreadsheetId,
        range
    }

    try {
        const response = await sheets.spreadsheets.values.get(request);
        const code = response.data.values[0][0];

        console.log("response retrieved from google sheet: " + response);
        console.log("Code retrieved from google sheet: " + code);

        return code;
    } catch (error) {
        console.error("Error retrieving refresh token from google sheet: " + error);

    }
};


//retrieve refresh token from google sheet 4163664d686d48426a434d41784d576a 7978774d4658424b4e6f4d4b4c43524b
async function retrieveRefreshToken() {
    const {sheets, spreadsheetId, sheetName} = await InventorySheetDetails();
    //hard code U2
    const range = `${sheetName}!W2`;

    const request = {
        spreadsheetId,
        range
    }

    try {
        const response = await sheets.spreadsheets.values.get(request);
        const refreshToken = response.data.values[0][0];

        console.log("response retrieved from google sheet: " + response);
        console.log("refresh token retrieved from google sheet: " + refreshToken);

        return refreshToken;
    } catch (error) {
        console.error("Error retrieving refresh token from google sheet: " + error);

    }
    // return "4f5952c75664f426f5a46516e79747a6d";
};


//for testing
router.get("/test", async (req, res) => {
    const refreshToken = await retrieveRefreshToken();

    res.send(refreshToken);
});


module.exports = router;