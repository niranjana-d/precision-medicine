const fs = require('fs');
const path = require('path');

async function verifyApi() {
    console.log("Starting API Verification...");

    const vcfPath = path.join(__dirname, '../mock_data/test.vcf');
    const fileBuffer = fs.readFileSync(vcfPath);
    const blob = new Blob([fileBuffer], { type: 'text/plain' });

    const formData = new FormData();
    formData.append('vcf_file', blob, 'test.vcf');
    formData.append('drugs', 'WARFARIN');
    formData.append('explanation_depth', 'summary');

    try {
        const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status} ${response.statusText}`);
            console.error(errorText);
            return;
        }

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));

        // Validation
        if (data.risk_assessment.risk_label === "Adjust Dosage" &&
            data.pharmacogenomics_profile.primary_gene === "CYP2C9") {
            console.log("✅ API Verification Passed");
        } else {
            console.error("❌ API Verification Failed: Unexpected result");
        }

    } catch (error) {
        console.error("Request Failed:", error);
    }
}

verifyApi();
