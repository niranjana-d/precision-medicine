const { parseVCF } = require('../src/services/vcfParser');
const { analyzeRisk } = require('../src/services/ruleEngine');
const path = require('path');

async function verify() {
    console.log("Starting Verification...");

    // 1. Test VCF Parsing
    const vcfPath = path.join(__dirname, '../mock_data/test.vcf');
    console.log(`\nTesting VCF Parsing with file: ${vcfPath}`);

    try {
        const { genes, variants } = await parseVCF(vcfPath);
        console.log("Parsed Genes:", genes);
        console.log("Parsed Variants:", variants);

        if (genes.includes('CYP2C9') && variants.find(v => v.rsid === 'rs1057910')) {
            console.log("✅ VCF Parsing Passed");
        } else {
            console.error("❌ VCF Parsing Failed");
        }

        // 2. Test Rule Engine
        console.log("\nTesting Rule Engine...");

        // Case A: Warfarin + CYP2C9 (Risk expected)
        const riskA = analyzeRisk('WARFARIN', genes, variants);
        console.log("Case A (Warfarin + CYP2C9):", riskA.risk_label);
        if (riskA.risk_label === "Adjust Dosage") {
            console.log("✅ Rule Engine Case A Passed");
        } else {
            console.error("❌ Rule Engine Case A Failed");
        }

        // Case B: Clopidogrel (No variant in test file)
        const riskB = analyzeRisk('CLOPIDOGREL', genes, variants);
        console.log("Case B (Clopidogrel - Safe):", riskB.risk_label);
        if (riskB.risk_label === "Safe") {
            console.log("✅ Rule Engine Case B Passed");
        } else {
            console.error("❌ Rule Engine Case B Failed");
        }

    } catch (error) {
        console.error("Verification Error:", error);
    }
}

verify();
