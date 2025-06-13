const fs = require("node:fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "public", "index.html");
const html = fs.readFileSync(filePath, { encoding: 'utf8' });

//test
const handler = async () => {
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
        },
        body: html,
    };
    return response;
};

module.exports = { handler };

