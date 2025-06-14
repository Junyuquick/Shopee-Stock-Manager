const express = require("express");
const fs = require("node:fs");
const path = require("path");
const serverless = require("serverless-http");

const app = express();
const apiRoute = require("./src/api.js");

// app.use(express.static(path.join(__dirname, "public")));

app.get("/script", (req, res) => {
    // Send the script.js file located in the 'public' directory
    res.sendFile(path.join(__dirname, "public", "script.js"));
});

app.use("/", apiRoute);


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
