const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");



async function InventorySheetDetails() {
    const credentials = await getGoogleCredentials();
    const auth = new GoogleAuth({
        "credentials": credentials,
        "scopes": ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1Fk9EiLKO8BeIe4dU_uiD9EUWuLdTZOoGCOMu-2Hl3v4";
    const sheetName = "Inventory";
    
    const body = {sheets, spreadsheetId, sheetName};
    console.log("Object body of {sheets, spreadsheetId, sheetName}: " + body);
    return body;
};

//might not need this 
async function OrderFrequencySheetDetails() {
    const credentials = await getGoogleCredentials();
    const auth = new GoogleAuth({
        "credentials": credentials,
        "scopes": ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1Fk9EiLKO8BeIe4dU_uiD9EUWuLdTZOoGCOMu-2Hl3v4";
    const sheetName = "Order Frequency";
    
    const body = {sheets, spreadsheetId, sheetName};
    console.log("Object body of {sheets, spreadsheetId, sheetName}: " + body);
    return body;
};


//to get google form details
async function googleFormSubmit(content) {
    const credentials = await getGoogleCredentials();
    const auth = new GoogleAuth({
        "credentials": credentials,
        "scopes": ["https://www.googleapis.com/auth/forms.body"]
    });


    const formId = "1FAIpQLSfosCuUfBUdINTextEVgE-PTPGjAMC6QcqUuk_cKHiUprPYaQ";
    const forms = google.forms({ version: "v1", auth });

    const answers = {
        "entry.746376853": "5000200130000",
        "entry.1981670210": "",
        "entry.1371453605": "",
        "entry.77854648": "",
        "entry.1942868880": ""
    };

    const formResponse = {
        value: answers
    }


    try {

        const response = await forms.forms.get({formId: formId});
        // const responseNames = Object.getOwnPropertyNames(response);
        // const JsonVersion0 = JSON.stringify(responseNames[0]);
        // const JsonVersion1 = JSON.stringify(responseNames[1]);

        // const response = await forms.forms.responses.create({
        //     formId: formId,
        //     requestBody: formResponse
        // });

        console.log("Resposnes Name: " + responseNames + "SPACE SPACE " + JsonVersion1);
        return response;
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }

};





async function getGoogleCredentials() {
    const secret_name = "google-credentials";

    const client = new SecretsManagerClient({
        region: "ap-southeast-1",
    });

    console.log("this is the client: " + client);

    // async function getSecret() {
    // console.log("running getSecret function");
    try {
        const command = new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT",
            });

        const response = await client.send(command);

        
        if ("SecretString" in response) {
            const secret = JSON.parse(response.SecretString);
            console.log("credentials obtained in writeToInventory Fxn: " + response.SecretString);
            return secret;
        } else {
            const buff = Buffer.from(response.SecretBinary, 'base64');
            const secret = JSON.parse(buff.toString('ascii')); // Return the binary secret as a string
            console.log("credentials obtained in writeToInventory Fxn: " + secret);
            return secret;
        }
    } catch (error) {
        console.error("Error retrieving secret:", error);
        throw error; // Re-throw the error for further handling
    }
            
        // const secret = JSON.parse(response.SecretString);
        // return secret;
    

    // getSecret().then(secret => {
    //     console.log("this is the secret keyyy: " + secret);
    //     return secret;
    // }).catch(err => {
    //     console.error(err);
    // });


};


module.exports = {InventorySheetDetails, OrderFrequencySheetDetails, getGoogleCredentials, googleFormSubmit};