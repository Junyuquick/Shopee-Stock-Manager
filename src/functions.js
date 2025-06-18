const CryptoJS = require("crypto-js");
const axios = require("axios");

//generate for shop apis
function generateShopAPIURLAndOtherData(path, access_token) {
     //! REMEMBER to change to change hostURL, partner_id, partner_key, shop_id
    const hostURL = "https://partner.test-stable.shopeemobile.com";

    const partner_id = 1280329;

    const partner_key = "776770536c46555a434c76717769625248664f4379414379494241764243494a";

    const timestamp = Math.floor(Date.now() / 1000);

    // //! call retrieveAccessToken, code is below
    // const access_token = "7a52667666526c7163656f4152757145";

    const shop_id = 144618;
    
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
function generatePublicAPIURLAndOtherData(path) {
    //! REMEMBER to change to change hostURL, partner_id, partner_key, shop_id
   const hostURL = "https://partner.test-stable.shopeemobile.com";

   const partner_id = 1280329;

   const partner_key = "776770536c46555a434c76717769625248664f4379414379494241764243494a";

   const timestamp = Math.floor(Date.now() / 1000);

   const shop_id = 144618;
   
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

module.exports = {generateShopAPIURLAndOtherData, generatePublicAPIURLAndOtherData};