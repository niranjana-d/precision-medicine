const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API Key missing");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const models = response.data.models.map(m => m.name);
        console.log("Available Models:", models.join(", "));
    } catch (error) {
        console.error("Error listing models:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

listModels();
