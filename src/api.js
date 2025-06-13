const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");


router.get('/', (req, res) => {
    res.json({message: "Hello World"})
})

module.exports = router;

// function startFunction() {
//     const hostURL = "https://partner.shopeemobile.com";

//     const partner_id = 1280329;

//     const partner_key = "776770536c46555a434c76717769625248664f4379414379494241764243494a";

//     const timestamp = Date.now();

//     //left access token and shop id, can be done after using azure as server, cant localhost
//     const access_token = "";

//     const shop_id = "";

//     const path = "/api/v2/shop/get_shop_info";
    
//     const base_string = partner_id + path + timestamp + access_token + shop_id;

//     const sign = generateHMAC(partner_key, base_string);


//     const requestURL = `${hostURL}${path}?partner_id=${partner_id}&timestamp=${timestamp}&access_token=${access_token}&shop_id=${shop_id}&sign=${sign}`;

//     fetch(requestURL)
//         .then(response => {
//             if (!response) {
//                 throw new Error("API failed")
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log("This is the data fetched: " + data);
//         })
//         .catch(error => {
//             console.log("Fetched Error: " + error);
//         })
// };

// //generate HMAC
// function generateHMAC(key, message) {
//     return CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Hex);
// }