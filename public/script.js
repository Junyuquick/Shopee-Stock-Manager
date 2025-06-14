const CryptoJS = require("crypto-js");

const button = document.getElementById('startButton');

button.addEventListener('click', function() {
    console.log("clicked once");
    startFunction();

    // fetch('https://api.quickjunyu.com')
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
});

// function to retrieve shop data
function startFunction() {

    fetch("https://quickjunyu.com/shop")
        .then(response => {
            if (!response) {
                throw new Error("API failed")
            }
            console.log("This is the response: " + response.json());
            return response.json();
        })
        .then(data => {
            console.log("This is the data fetched: " + data);
        })
        .catch(error => {
            console.log("Fetched Error: " + error);
        })
};

