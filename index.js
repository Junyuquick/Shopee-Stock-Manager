const express = require("express");
const fs = require("node:fs");
const path = require("path");
const serverless = require("serverless-http");

const app = express();
const apiRoute = require("./src/api.js");
const shopeeAuthRoute = require("./src/shopeeAuth.js");
const shopeeApiRoute = require("./src/shopeeAPI.js");
const googleSheetUpdateRoute = require("./src/googleSheetUpdate.js")

// app.use(express.static(path.join(__dirname, "public")));


app.use(express.json());
app.use("/", apiRoute);
app.use("/shopeeauth", shopeeAuthRoute);
app.use("/shopeeapi", shopeeApiRoute);
app.use("/googlesheetupdate", googleSheetUpdateRoute);


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
