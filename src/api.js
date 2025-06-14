const express = require("express");
const router = express.Router();
const path = require("path");
const CryptoJS = require("crypto-js");
const axios = require("axios");


router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

router.get("/apple", (req, res) => {
    res.send("apple");
});

router.get("/script", (req, res) => {
    // Send the script.js file located in the 'public' directory
    res.sendFile(path.join(__dirname, "..", "public", "script.js"));
});


router.get("/shop", async (req, res) => {
    //!REMEMBER to change to non-test url
    const hostURL = "https://partner.test-stable.shopeemobile.com";

    const partner_id = 1280329;

    const partner_key = "776770536c46555a434c76717769625248664f4379414379494241764243494a";

    const timestamp = Math.floor(Date.now() / 1000);
    // const timestamp = Date.now();

    //left access token and shop id, can be done after using azure as server, cant localhost
    const access_token = "7a52667666526c7163656f4152757145";

    const shop_id = 144618;

    const path = "/api/v2/shop/get_shop_info";
    
    const base_string = partner_id + path + timestamp + access_token + shop_id;

    const sign = generateHMAC(partner_key, base_string);


    const requestURL = `${hostURL}${path}?partner_id=${partner_id}&timestamp=${timestamp}&access_token=${access_token}&shop_id=${shop_id}&sign=${sign}`;


    //generate HMAC
    function generateHMAC(key, message) {
        return CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Hex);
    }


    try {
        const response = await axios.get(requestURL);
        res.json(response.data);
    } catch (error) {
        console.log("Error fetching shopee data: ", error);
        res.status(500).send("wrriten: internal server error");
    }

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