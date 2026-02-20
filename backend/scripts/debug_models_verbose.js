const axios = require('axios');
require('dotenv').config();

async function listModels() {
    console.log("Script starting...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API Key missing");
        return;
    }
    console.log("API Key present (length: " + apiKey.length + ")");

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        console.log("Fetching models...");
        const response = await axios.get(url);
        console.log("Response status:", response.status);
        console.log("Response data keys:", Object.keys(response.data));

        if (response.data.models) {
            console.log("Number of models found:", response.data.models.length);
            // Print first 5 models to avoid huge output
            response.data.models.slice(0, 5).forEach(m => console.log("- " + m.name));
        } else {
            console.log("No 'models' property in response data.");
            console.log("Full data:", JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.error("Error listing models:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

listModels();
