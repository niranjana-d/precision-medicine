const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        // For 0.24.1, we might need to access the model manager differently or it might not be exposed directly in this way?
        // Actually, usually it's not directly exposed on genAI main class in easy way in older versions?
        // Wait, let's try to just instantiate a model and see if it works with 'gemini-pro' again?
        // But let's try to see if we can list models via REST API if SDK doesn't support it easily?
        // The SDK likely doesn't have listModels on the main class.

        // Let's try to just check if 'gemini-pro' works on v1beta.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-pro response:", result.response.text());

    } catch (error) {
        console.error("Error listing/testing models:", error.message);
    }
}

listModels();
