const express = require("express");
const router = express.Router();
const { googleFormSubmit } = require("./googleAuth.js")
const axios = require("axios");
const { InventorySheetDetails } = require("./googleAuth.js");
const {generateShopAPIURLAndOtherData, generatePublicAPIURLAndOtherData} = require("./functions.js");


//used to submit google form with info ovtained from below functions
router.get("/", async (req, res) => {
    // const response = await googleFormSubmit();

    // const dataToSubmit = "";
    // const URIencodedData = encodeURIComponent(dataToSubmit);

    const entry1 = await formSubmissionBody1stQn();
    console.log("entry1: ", entry1);

    //have the front end allow for 2 options, tdy or yst, but cloudwatch default calls yst, run 12am 1sec
    let entry2 = req.query.day || "yst";

    try {
        const response = await axios.post(`https://docs.google.com/forms/d/e/1FAIpQLSfosCuUfBUdINTextEVgE-PTPGjAMC6QcqUuk_cKHiUprPYaQ/formResponse?entry.746376853=${entry1}&entry.1981670210=${entry2}`);

        // const response = await axios.post(`https://docs.google.com/forms/d/e/1FAIpQLSfosCuUfBUdINTextEVgE-PTPGjAMC6QcqUuk_cKHiUprPYaQ/formResponse?entry.746376853=5000200130000`);
        const responseObject = {
            Skus: entry1,
            Date: entry2
        }
        res.json(responseObject);
        // res.send(JSON.stringify(responseObject)); //comment this instead ltr


    } catch (error) {
        console.error(error);
        throw error;

    }

});


//tested GOOD
async function formSubmissionBody1stQn() {
    const allItemStockAndSku = await retrieveStockFromShopee();
    console.log("allItemStockAndSku: ", allItemStockAndSku);

    let body = ""; //format eg. = "5055534324455 x3 5055534302705 50    56104559710 x-2";  

    for (const key in allItemStockAndSku) {
        const allVariationSkuAndStockArray = allItemStockAndSku[key]; // data eg. = [[sku1, totalStock1], [sku2, totalStock2]]

        for (const item of allVariationSkuAndStockArray) {
            const targetVariation = item; // data eg. = [sku1, totalStock1]
            const targetShopeeSku = targetVariation[0];
            const targetShopeeStock = targetVariation[1];

            if (targetShopeeSku == 0 || targetShopeeSku == "0" || isNaN(Number(targetShopeeSku))) {
                console.log("targetShopeeSku is 0, continue");
                continue;
            }

            const GoogleSheetWarehouseStock = await retrieveSpecificStockFromGoogleSheet(targetShopeeSku) || 0;

            const diffInStock = Number(GoogleSheetWarehouseStock) - Number(targetShopeeStock);

            if (diffInStock > 0) {
                body = body + targetShopeeSku + " x" + diffInStock + " ";
                console.log("diffInStock > 0, body: " + body);
            } else if (diffInStock < 0) {
                body = body + targetShopeeSku + " x" + diffInStock + " "; 
                console.log("diffInStock < 0, body: " + body);
            } else if (diffInStock == 0) {
                continue;
            }
        }
    }

    if (body == "") {
        return "NIL";
    }

    return body.slice(0, -1);
};



//test variable for fxn below 
const testVariable = {
	"message": "-",
	"warning": "-",
	"request_id": "75c2b01e50764cec8cfdc61e75c1f26d",
	"response": {
		"tier_variation": [
			{
				"option_list": [
					{
						"option": "testsku1",
						"image": {
							"image_id": "-",
							"image_url": "-"
						}
					}
				],
				"name": "-"
			}
		],
		"model": [
			{
				"price_info": [
					{
						"currency": "TWD",
						"current_price": 100,
						"original_price": 100,
						"inflated_price_of_original_price": 100,
						"inflated_price_of_current_price": 100,
						"sip_item_price": 100,
						"sip_item_price_source": "manual",
						"sip_item_price_currency": "CNY"
					}
				],
				"model_sku": "5000200130000",
				"model_status": "MODEL_NORMAL",
				"pre_order": {
					"is_pre_order": false,
					"days_to_ship": 3
				},
				"stock_info_v2": {
					"summary_info": {
						"total_reserved_stock": 0,
						"total_available_stock": 0
					},
					"seller_stock": [
						{
							"location_id": "-",
							"stock":100,
							"if_saleable": true
						}
					],
					"shopee_stock": [
						{
							"location_id": "-",
							"stock": "-"
						}
					]
				},
				"gtin_code": "-",
				"weight": "1.1",
                                "dimension": {
                                    "package_height": 11,
                                    "package_length": 11,
                                    "package_width": 11
                },
			},
            {
				"price_info": [
					{
						"currency": "TWD",
						"current_price": 100,
						"original_price": 100,
						"inflated_price_of_original_price": 100,
						"inflated_price_of_current_price": 100,
						"sip_item_price": 100,
						"sip_item_price_source": "manual",
						"sip_item_price_currency": "CNY"
					}
				],
				"model_sku": "5000200130001",
				"model_status": "MODEL_NORMAL",
				"pre_order": {
					"is_pre_order": false,
					"days_to_ship": 3
				},
				"stock_info_v2": {
					"summary_info": {
						"total_reserved_stock": 0,
						"total_available_stock": 0
					},
					"seller_stock": [
						{
							"location_id": "-",
							"stock": 22,
							"if_saleable": true
						}
					],
					"shopee_stock": [
						{
							"location_id": "-",
							"stock": 78
						}
					]
				},
				"gtin_code": "-",
				"weight": "1.1",
                                "dimension": {
                                    "package_height": 11,
                                    "package_length": 11,
                                    "package_width": 11
                },
			}
		],
		"standardise_tier_variation": [
			{
				"variation_name": "-",
				"variation_option_list": [
					{
						"variation_option_name": "-",
						"image_id": "-",
						"image_url": "-"
					}
				]
			}
		]
	},
	"error": "-"
};
// the returned object should look like this 
// {   
//     item_id1: [[sku1, totalStock1], [sku2, totalStock2]],
//     item_id2: [],
//     item_id3: [],
//     item_id4: []
// }
async function retrieveStockFromShopee() {
    //retrieve access token hard code V2
    const access_token = await retrieveBasedOnCellNotation("V2");
    const path = "/api/v2/product/get_model_list";

    const { requestURL } = await generateShopAPIURLAndOtherData(path, access_token);

    //retrieve item id list, hard code U9
    const item_id_listAsString = await retrieveBasedOnCellNotation("U9");
    const item_id_list = JSON.parse(item_id_listAsString);


    let itemIdsObject = {}; //for loop below will keep pushing new properties with value(type:array) into this object

    for (let i = 0; i < item_id_list.length; i++) {
        const item_id = item_id_list[i];

        try {
            const updatedRequestURL = requestURL + `&item_id=${item_id}`;

            ///comment if need for testing
            const response = await axios.get(updatedRequestURL);
            const responseObject = response.data; //this contains object with all the variants(aka models), need for loop
            const variantsList = responseObject.response.model; //type: list
            // const variantsList = testVariable.response.model; ///this is the test variable

            let variantsArray = []; //for loop below will keep pushing new arrays with (sku, totalStock) into it


            for (let j = 0; j < variantsList.length; j++) {
                const itemSku = variantsList[j].model_sku;
                const itemShopeeStock = variantsList[j].stock_info_v2.shopee_stock[0].stock; //!!!!!! need to put shopee_stock[0] becuz its an array, not sure how shopee split up diff variant of same product, is in model array? or in stock array, etc. test real data
                const itemSellerStock = variantsList[j].stock_info_v2.seller_stock[0].stock;
                const totalStock = (Number(itemShopeeStock) || 0) + (Number(itemSellerStock) || 0);

                const array = [
                    itemSku,
                    totalStock
                ];

                variantsArray.push(array);    
                const JSONversion = JSON.stringify(variantsArray); //for logging 
                console.log("Array containing all the variants of a single item, inside contains the sku and totalStock of the variant : " + variantsArray);
    
            }

            itemIdsObject[item_id] = variantsArray;
        } catch (error) {
            console.log("this is the error: " + error);
        };
    }
    
        const JSONversion = JSON.stringify(itemIdsObject); //for logging 
        console.log("Object containing all the items in my shop, each item contains the array of variants of a single item: " + JSONversion);

        return itemIdsObject;
};


//retrieve the warehouse stock from column F . TESTED GOOD
async function retrieveSpecificStockFromGoogleSheet(sku) {
    const column = "F";

    const targetRow = await rowOfTargetSku(sku);
    const warehouseStock = await retrieveBasedOnCellNotation(`${column}${targetRow}`);

    return warehouseStock;
};


//scan column I(SKU) to find the target SKU, and return the row number, TESTED- GOOD
async function rowOfTargetSku(sku) {
    const {sheets, spreadsheetId, sheetName} = await InventorySheetDetails();

    //hard code I
    const range = `${sheetName}!I:I`;

    const request = {
        spreadsheetId,
        range
    };

    try {
        const response = await sheets.spreadsheets.values.get(request);
        const rows = response.data.values;

        if (rows && rows.length) {
            for (let row of rows) {
                if (row.length > 0 && String(row[0]) == String(sku)) {
                    const targetRow = rows.indexOf(row) + 1;
                    return targetRow;
                }
            }
        } else {
            throw new Error("no SKU data found in googlesheet column I");
        }

    } catch (error) {
        console.error("Error retrieving SKU data from googlesheet column I: " + error);
    };

    

    return targetRow;
};



async function retrieveBasedOnCellNotation(notation) {
    const {sheets, spreadsheetId, sheetName} = await InventorySheetDetails();
    
    const range = `${sheetName}!${notation}`;

    const request = {
        spreadsheetId,
        range
    };

    try {
        const response = await sheets.spreadsheets.values.get(request);
        const accessToken = response.data.values[0][0];

        console.log("response retrieved from google sheet: " + response);
        console.log("Access token or smth else retrieved from google sheet: " + accessToken);

        return accessToken;
    } catch (error) {
        console.error("Error retrieving refresh token or smth else from google sheet: " + error);

    }
    // return "4f5952c75664f426f5a46516e79747a6d";
};


router.post("/logging", async (req, res) => {
    const {sheets, spreadsheetId, sheetName} = await InventorySheetDetails();
    
    const range = `${sheetName}!U2`;

    const originalNote = JSON.parse(req.body);
    const note = originalNote.message;
    // const note =  "test1";


    try {
        console.log("this is range: " + [range]);
        const response = await sheets.spreadsheets.get({
            spreadsheetId,
            ranges: [range],
            fields: 'sheets.data.rowData.values.note'
        });
        console.log("this fxn works ");
        const currentNote = response.data.sheets[0].data[0].rowData[0].values[0].note || '';
    
        // Append the new note to the existing one
        const newNote = currentNote + '\n' + '\n' + note;
    
        // Update the cell with the new note
        console.log("this is range: " + range);
        console.log("this is newNote: " + newNote);
        // await sheets.spreadsheets.values.update({
        //     spreadsheetId,
        //     range,
        //     valueInputOption: 'USER_ENTERED',
        //     resource: {
        //         values: [[null, null, null, null, null, newNote]] // Adjust based on the cell
        //     }
        // });

        const response2 = await sheets.spreadsheets.get({
            spreadsheetId,
            includeGridData: false // We only need metadata
        });
        const sheet = response2.data.sheets.find(s => s.properties.title === sheetName);
        console.log("this is sheet: " + sheet);
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {
                requests: [
                    {
                        updateCells: {
                            rows: [{
                                values: [{
                                    note: newNote
                                }]
                            }],
                            range: {
                                sheetId: sheet.properties.sheetId,
                                startRowIndex: 1, // Adjust based on your row
                                startColumnIndex: 20 // Adjust based on your column
                            },
                            fields: 'note'
                        }
                    }
                ]
            }
        });


        res.send("Logging note updated successfully");
    } catch (error) {
        console.error("Error retrieving refresh token or smth else from google sheet: " + error);
        res.send("Error updating logging note");
    };


});

router.get("/test", async (req, res) => {
    const response = await formSubmissionBody1stQn();
    res.send("This is the response: " + response);
});



// module.exports = router;
module.exports = {router, retrieveBasedOnCellNotation};
