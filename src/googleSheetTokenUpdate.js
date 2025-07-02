const { InventorySheetDetails, OrderFrequencySheetDetails, getGoogleCredentials } = require("./googleAuth.js");
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
    try {
        console.log("begin /googleSheetTokenUpdatepdate api)");

        const contentJSON = await axios.get("https://quickjunyu.com/shopeeapi/shop");
        const content = contentJSON.data;
        console.log("type of content is: " + typeof(content));

        const response = await addingNewRefreshTokenToGoogleSheet(content);
        console.log("last response for /googleSheetTokenUpdate api: " + response);
        res.send(response);
    } catch (error) {
        res.send("Main and Failed API used: /googleSheetTokenUpdatepdate. " + "\n" + "Error with calling google API: " + error);
    }
});


async function addingNewRefreshTokenToGoogleSheet(content) {

    const accessToken = content.access_token;
    const refreshToken = content.refresh_token;

    const now = new Date();
    const options = {
        weekday: 'long', // e.g., "Monday"
        year: 'numeric', // e.g., "2023"
        month: 'long',   // e.g., "June"
        day: 'numeric',  // e.g., "20"
        hour: '2-digit', // e.g., "03"
        minute: '2-digit', // e.g., "30"
        second: '2-digit', // e.g., "05"
        hour12: true, // Use 12-hour format
        timeZone: 'Asia/Singapore' // Specify Singapore time zone
    };
    const readableDateTimeSGT = now.toLocaleString('en-US', options);


    const {sheets, spreadsheetId, sheetName} = await InventorySheetDetails();

    //hard code U2
    const range = `${sheetName}!U2`

    const value = [[readableDateTimeSGT, accessToken, refreshToken]];

    const request = {
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        resource: {
            values: value,
        }
    }

    try {
        const response = await sheets.spreadsheets.values.update(request);
        console.log("cell updated: " + response.data);
        // const returnBody = `Date: ${readableDateTimeSGT}, New Access Token: ${accessToken}, New Refresh Token: ${refreshToken} `;
        const returnBody = {
            date: readableDateTimeSGT,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
        return returnBody;
    } catch (error) {
        throw error;
    };

};


//function to retrieve 



module.exports = {router, addingNewRefreshTokenToGoogleSheet};