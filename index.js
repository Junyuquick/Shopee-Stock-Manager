const express = require("express");
const fs = require("node:fs");
const path = require("path");
const serverless = require("serverless-http");
const axios = require("axios");

const app = express();
const apiRoute = require("./src/api.js");
const shopeeAuthRoute = require("./src/shopeeAuth.js");
const shopeeApiRoute = require("./src/shopeeAPI.js");
const {router: googleSheetTokenUpdateRoute} = require("./src/googleSheetTokenUpdate.js");
const {router: googleSheetShopeeStockUpdateRoute} = require("./src/googleSheetShopeeStockUpdate.js");

// app.use(express.static(path.join(__dirname, "public")));


app.use(express.json());
app.use("/shopee", apiRoute);
app.use("/shopeeauth", shopeeAuthRoute);
app.use("/shopeeapi", shopeeApiRoute);
app.use("/googlesheettokenupdate", googleSheetTokenUpdateRoute);
app.use("/googlesheetshopeestockupdate", googleSheetShopeeStockUpdateRoute);


app.get("/overallupdate", async (req, res) => {
    try {

        let day = req.query.day || "yst";
        const refreshTokenResponse = await axios.get("https://quickjunyu.com/googlesheettokenupdate");
        const stockUpdateResponse = await axios.get(`https://quickjunyu.com/googlesheetshopeestockupdate?day=${encodeURIComponent(day)}`);
        console.log("Refresh Token Response:", refreshTokenResponse.data);
        console.log("Stock Update Response:", stockUpdateResponse.data);

        // const response = `Response from Refresh Token Update API: ${refreshTokenResponse.data}. Response from Stock Update API: ${JSON.stringify(stockUpdateResponse.data)}`;
        // console.log("response 1: " + response);

        const {date, accessToken, refreshToken} = refreshTokenResponse.data;
        const response = `Date: ${date}\nAccess Token: ${accessToken}\nRefresh Token: ${refreshToken}\nForm Submitted: ${JSON.stringify(stockUpdateResponse.data)}`;

        const messagePosted = {"message": response};
        const loggingResponse = await axios.post("https://quickjunyu.com/googlesheetshopeestockupdate/logging", messagePosted, {headers: {'Content-Type': 'application/json'}});
        console.log("loggingResponse: " + JSON.stringify(loggingResponse.data));

        // const browserResponse = response + JSON.stringify(loggingResponse.data);
        const browserResponse = {
            date,
            accessToken,
            refreshToken,
            stockUpdateResponse: stockUpdateResponse.data,
            loggingResponse: loggingResponse.data
        }
        console.log("browserResponse: " + browserResponse);
        res.send(browserResponse);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error: " + error);
    }

});

module.exports.handler = serverless(app);

// const filePath = path.join(__dirname, "public", "index.html");
// const html = fs.readFileSync(filePath, { encoding: 'utf8' });

//test
// const handler = async () => {
//     const response = {
//         statusCode: 200,
//         headers: {
//             'Content-Type': 'text/html',
//         },
//         body: html,
//     };
//     return response;
// };

// module.exports = { handler };
