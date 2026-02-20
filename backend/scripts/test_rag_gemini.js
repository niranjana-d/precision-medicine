const { generateExplanation } = require('../src/services/geminiService');

async function testRagGemini() {
    console.log("Starting RAG + Gemini Verification Test...\n");

    const testCase = {
        drug: "Warfarin",
        gene: "CYP2C9",
        phenotype: "Intermediate Metabolizer",
        riskLabel: "Moderate"
    };

    console.log(`Testing with: ${JSON.stringify(testCase, null, 2)}\n`);

    const result = await generateExplanation(
        testCase.drug,
        testCase.gene,
        testCase.phenotype,
        testCase.riskLabel
    );

    console.log("--- Result ---");
    console.log(JSON.stringify(result, null, 2));

    // Validations
    if (result.summary.includes("Service Unavailable")) {
        console.error("\n❌ Test Failed: AI Service Unavailable or API Key missing.");
    } else if (result.summary.includes("Explanation unavailable")) {
        console.error("\n❌ Test Failed: Gemini failed to generate valid JSON.");
    } else {
        console.log("\n✅ Test Passed: Received valid explanation.");
        // We can't easily check for hallucinations without human review, but we can check if it mentions guidelines
        if (result.expanded.toLowerCase().includes("guideline") || result.expanded.toLowerCase().includes("cpic")) {
            console.log("✅ Context Usage: Response references guidelines/CPIC.");
        } else {
            console.warn("⚠️ Warning: Response might not be referencing guidelines explicitly.");
        }
    }
}

testRagGemini();
