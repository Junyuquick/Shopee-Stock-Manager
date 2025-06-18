const { writeToInventorySheet, writeToOrderFrequencySheet } = require("./googleAuth");
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
    try {
        const response = await editTestInventory();
        res.send(response);
    } catch (error) {
        res.send("Main and Failed API used: /googlesheetupdate. " + "\n" + "Error with calling google API: " + error);
    }
});


async function editTestInventory () {
    const {sheets, spreadsheetId, sheetName} = writeToInventorySheet();

    const range = `${sheetName}!M13`

    const value = [["hello", "world"],
                    ["nice", "cock"]
                ];

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
        return `this is the value inputted: ${value}`;
    } catch (error) {
        throw error;
    };

};





module.exports = router;