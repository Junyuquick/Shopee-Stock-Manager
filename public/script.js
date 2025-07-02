
// const button = document.getElementById('startButton');

// button.addEventListener('click', function() {
//     console.log("clicked once");
//     startFunction();

//     // fetch('https://api.quickjunyu.com')
//     //     .then(response => response.json())
//     //     .then(data => {
//     //         console.log(data);
//     //     })
//     //     .catch(error => {
//     //         console.error('Error:', error);
//     //     });
// });

const form = document.getElementById("shopeeForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedOption = document.getElementById("dateOptions").value; 

    startFunction(selectedOption);  
})


// function to retrieve shop dataff
function startFunction(date) {

    let day = date;
    fetch(`https://quickjunyu.com/overallupdate?day=${encodeURIComponent(day)}`)
        .then(response => {
            if (!response.ok) {
                // Return a resolved promise to avoid showing the error
                return Promise.resolve({ error: true, message: "Service Unavailable" });
            };
            return response.json();
        })
        .then(data => {
            htmlContent = `
                <div> DATA UPDATED </div>
                <div> Date: ${data.date} </div>
                <div> Access Token: ${data.accessToken} </div>
                <div> Refresh Token: ${data.refreshToken} </div>
                <div> Google Sheet Logs: ${data.loggingResponse} </div><br>
                <div> FORM SUBMISSION DATA: </div>
                <div> ${JSON.stringify(data.stockUpdateResponse)} </div>
            `
            // date,
            // accessToken,
            // refreshToken,
            // stockUpdateResponse: stockUpdateResponse.data,
            // loggingResponse: loggingResponse.data


            const divElement = document.getElementById("responseMessage");
            divElement.innerHTML = htmlContent;
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })
};




const initForm = document.getElementById("initForm");

initForm.addEventListener("submit", function (event) {
    event.preventDefault();

    initNewCode();  
})


function initNewCode() {
    fetch(`https://quickjunyu.com/shopeeauth/init`)
        .then(response => {
            if (!response.ok) {
                // Return a resolved promise to avoid showing the error
                return Promise.resolve({ error: true, message: "Service Unavailable" });
            };
            return response.json();
        })
        .then(data => {
            htmlContent = `
                <div> DATA UPDATED </div>
                <div> Access Token: ${data.accessToken} </div>
                <div> Refresh Token: ${data.refreshToken} </div>
                <div> Google Sheet Logs: ${data.loggingResponse} </div>
            `
            // date,
            // accessToken,
            // refreshToken,
            // stockUpdateResponse: stockUpdateResponse.data,
            // loggingResponse: loggingResponse.data


            const divElement = document.getElementById("initResponseMessage");
            divElement.innerHTML = htmlContent;
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })

};