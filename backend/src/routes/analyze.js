const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { parseVCF } = require('../services/vcfParser');
const { analyzeRisk } = require('../services/ruleEngine');
const { generateExplanation } = require('../services/geminiService');
const { buildResponse } = require('../utils/schemaBuilder');

// Configure Multer for file upload
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/analyze', upload.single('vcf_file'), async (req, res) => {
    try {
        // 1. Validation
        if (!req.file) {
            return res.status(400).json({ error: 'Invalid Input', message: 'VCF file is required.' });
        }
        if (!req.body.drugs) {
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Invalid Input', message: 'Drug name is required.' });
        }

        // Check strict single drug constraint
        const drugsInput = req.body.drugs.trim();
        if (drugsInput.includes(',')) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Invalid Input', message: 'Only one drug allowed per request.' });
        }

        // 2. Parse VCF
        const vcfPath = req.file.path;
        let parsingResult;
        try {
            parsingResult = await parseVCF(vcfPath);
        } catch (parseError) {
            console.error("VCF Parse Error:", parseError);
            fs.unlinkSync(vcfPath);
            return res.status(500).json({ error: 'Processing Error', message: 'Failed to parse VCF file.' });
        }

        // Cleanup file immediately after parsing
        fs.unlinkSync(vcfPath);

        const { genes, variants } = parsingResult;

        // 3. Rule Engine Execution
        const drugName = drugsInput;
        const riskData = analyzeRisk(drugName, genes, variants);

        // 4. Gemini Explanation
        // We only explain the primary gene involved in the risk
        const explanation = await generateExplanation(
            drugName,
            riskData.pharmacogenomics_profile.primary_gene,
            riskData.pharmacogenomics_profile.phenotype,
            riskData.risk_label,
            req.body.explanation_depth || 'summary'
        );

        // 5. Build Response
        // Filter variants to only include those relevant to the analyzed gene (optional, but cleaner)
        // The schema says "detected_variants" which implies ALL variants or just relevant ones?
        // "detected_variants": [ { "rsid": "rs1057910", "gene": "CYP2C9" } ]
        // Usually relevant to the finding. I'll filter for the primary gene if known.

        let relevantVariants = variants;
        if (riskData.pharmacogenomics_profile.primary_gene !== 'Unknown') {
            relevantVariants = variants.filter(v => v.gene === riskData.pharmacogenomics_profile.primary_gene);
        }

        // If no specific variants found for the gene (e.g. SAFE result where we checked for gene but didn't find it), 
        // we might want to return empty list or all variants?
        // If SAFE, it means NO variants found for that gene. So relevantVariants will be empty. This is correct.
        // Wait, if genes list has the gene, it means we found it. ruleEngine checks `parsedGenes.includes(rule.gene)`.
        // So if present, we found variants. If not present, we didn't. 
        // So filtering is correct.

        const response = buildResponse(
            "PATIENT_" + Math.floor(Math.random() * 1000).toString().padStart(3, '0'), // Mock ID
            drugName,
            riskData,
            relevantVariants,
            explanation,
            true
        );

        res.json(response);

    } catch (error) {
        console.error("Server Error:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

module.exports = router;
