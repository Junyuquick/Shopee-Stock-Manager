const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");



function writeToInventorySheet() {
    const credentials = getGoogleCredentials();
    const auth = new GoogleAuth({
        "credentials": credentials,
        "scopes": ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1Fk9EiLKO8BeIe4dU_uiD9EUWuLdTZOoGCOMu-2Hl3v4";
    const sheetName = "Test Inventory";
    
    return {sheets, spreadsheetId, sheetName};
};


function writeToOrderFrequencySheet() {
    const credentials = getGoogleCredentials();
    const auth = new GoogleAuth({
        "credentials": credentials,
        "scopes": ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1Fk9EiLKO8BeIe4dU_uiD9EUWuLdTZOoGCOMu-2Hl3v4";
    const sheetName = "Test Order Frequency";
    
    return {sheets, spreadsheetId, sheetName};
};


function getGoogleCredentials() {
    const secret_name = "google-credentials";

    const client = new SecretsManagerClient({
        region: "ap-southeast-1",
    });

    let response;

    async function getSecret() {
        try {
            response = await client.send(
                new GetSecretValueCommand({
                    SecretId: secret_name,
                    VersionStage: "AWSCURRENT",
                })
            );
        } catch (error) {
            throw error;
        }

        const secret = JSON.parse(response.SecretString);
        return secret;
    }


    let result;

    getSecret().then(secret => {
        result = secret;
        console.log(secret);
    }).catch(err => {
        console.error(err);
    });

    return result;

};


module.exports = {writeToInventorySheet, writeToOrderFrequencySheet};