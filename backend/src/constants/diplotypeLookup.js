/**
 * Diplotype Lookup Table
 * Maps (gene, rsid, genotype) → star allele assignment → phenotype
 *
 * Genotype key:
 *   "0/0" = homozygous reference (wild-type)
 *   "0/1" = heterozygous (one variant allele)
 *   "1/1" = homozygous variant (two variant alleles)
 */

const DIPLOTYPE_TABLE = {
    CYP2C9: {
        rsids: ["rs1057910"],
        genotypes: {
            "0/0": { diplotype: "*1/*1", phenotype: "Normal Metabolizer" },
            "0/1": { diplotype: "*1/*3", phenotype: "Intermediate Metabolizer" },
            "1/1": { diplotype: "*3/*3", phenotype: "Poor Metabolizer" }
        }
    },
    CYP2C19: {
        rsids: ["rs4244285"],
        genotypes: {
            "0/0": { diplotype: "*1/*1", phenotype: "Normal Metabolizer" },
            "0/1": { diplotype: "*1/*2", phenotype: "Intermediate Metabolizer" },
            "1/1": { diplotype: "*2/*2", phenotype: "Poor Metabolizer" }
        }
    },
    CYP2D6: {
        rsids: ["rs3892097"],
        genotypes: {
            "0/0": { diplotype: "*1/*1", phenotype: "Normal Metabolizer" },
            "0/1": { diplotype: "*1/*4", phenotype: "Intermediate Metabolizer" },
            "1/1": { diplotype: "*4/*4", phenotype: "Ultra-Rapid Metabolizer" }
        }
    },
    SLCO1B1: {
        rsids: ["rs4149056"],
        genotypes: {
            "0/0": { diplotype: "*1a/*1a", phenotype: "Normal Function" },
            "0/1": { diplotype: "*1a/*5", phenotype: "Intermediate Function" },
            "1/1": { diplotype: "*5/*5", phenotype: "Poor Function" }
        }
    },
    TPMT: {
        rsids: ["rs1800460"],
        genotypes: {
            "0/0": { diplotype: "*1/*1", phenotype: "Normal Metabolizer" },
            "0/1": { diplotype: "*1/*3A", phenotype: "Intermediate Metabolizer" },
            "1/1": { diplotype: "*3A/*3A", phenotype: "Poor Metabolizer" }
        }
    },
    DPYD: {
        rsids: ["rs3918290"],
        genotypes: {
            "0/0": { diplotype: "*1/*1", phenotype: "Normal Metabolizer" },
            "0/1": { diplotype: "*1/*2A", phenotype: "Intermediate Metabolizer" },
            "1/1": { diplotype: "*2A/*2A", phenotype: "Poor Metabolizer" }
        }
    }
};

/**
 * Determines phenotype from a gene and its detected variants.
 * @param {string} gene - Gene symbol (e.g. "CYP2C9")
 * @param {Array<Object>} variants - Variant objects with { rsid, gene, genotype }
 * @returns {Object} - { diplotype, phenotype } or defaults
 */
function getPhenotype(gene, variants) {
    const lookup = DIPLOTYPE_TABLE[gene];
    if (!lookup) {
        return { diplotype: "Unknown", phenotype: "Unknown" };
    }

    // Find relevant variants for this gene
    const geneVariants = variants.filter(v => v.gene === gene);

    if (geneVariants.length === 0) {
        return { diplotype: "*1/*1", phenotype: "Normal Metabolizer" };
    }

    // Use the first matching variant's genotype
    for (const variant of geneVariants) {
        const gt = variant.genotype;
        if (gt && lookup.genotypes[gt]) {
            return lookup.genotypes[gt];
        }
    }

    // Default: if genotype is present but not in our table
    return { diplotype: "Unknown", phenotype: "Unknown" };
}

module.exports = { DIPLOTYPE_TABLE, getPhenotype };
