const { InventorySheetDetails } = require("./googleAuth.js");
const CryptoJS = require("crypto-js");
const axios = require("axios");


//! REMEMBER to change to change hostURL, partner_id, partner_key, shop_id 
// const hostURL = "https://partner.test-stable.shopeemobile.com";
// const partner_id = 1280681;
// const partner_key = "716359736542644143586c446972556244766e765576716641787a674d72706b";
// const shop_id = 146883;




const hostURL = "https://partner.shopeemobile.com";
const partner_id = 2011835; //expires 
// const partner_key = "shpk61636e466e444b667664496d6a6d6949425a46677661734a687a49527675"; //expires
const shop_id = 524461958;



//generate for shop apis
async function generateShopAPIURLAndOtherData(path, access_token) {
     
    const partner_key = await retrieveBasedOnCellNotation("V5");

    const timestamp = Math.floor(Date.now() / 1000);

    const base_string = partner_id + path + timestamp + access_token + shop_id;

    const sign = generateHMAC(partner_key, base_string);


    const requestURL = `${hostURL}${path}?partner_id=${partner_id}&timestamp=${timestamp}&access_token=${access_token}&shop_id=${shop_id}&sign=${sign}`;

    const body = {
        "hostURL": hostURL,
        "partner_id": partner_id,
        "partner_key": partner_key,
        "timestamp": timestamp,
        "access_token": access_token,
        "shop_id": shop_id,
        "sign": sign,
        "requestURL": requestURL
    };

    return body;

};

//generate for public apis
async function generatePublicAPIURLAndOtherData(path) {
   
   const partner_key = await retrieveBasedOnCellNotation("V5");

   const timestamp = Math.floor(Date.now() / 1000);

   
   const base_string = partner_id + path + timestamp;

   const sign = generateHMAC(partner_key, base_string);

   const requestURL = `${hostURL}${path}?partner_id=${partner_id}&timestamp=${timestamp}&sign=${sign}`;

   const body = {
    "hostURL": hostURL,
    "partner_id": partner_id,
    "partner_key": partner_key,
    "timestamp": timestamp,
    "shop_id": shop_id,
    "sign": sign,
    "requestURL": requestURL
    };

    return body;

};


///generate HMAC
function generateHMAC(key, message) {
    return CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Hex);
}

//retrieve access token from google sheet
function retrieveAccessToken() {
    return "7a52667666526c7163656f4152757145";

}

//retrieve a google sheet cell based on cell notation
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




module.exports = {generateShopAPIURLAndOtherData, generatePublicAPIURLAndOtherData};