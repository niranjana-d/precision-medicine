const fs = require('fs');
const readline = require('readline');

/**
 * Parses a VCF file to extract gene and variant information.
 * @param {string} filePath - Path to the VCF file.
 * @returns {Promise<Object>} - Object containing unique genes and list of variants.
 */
async function parseVCF(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const genes = new Set();
  const variants = [];

  for await (const line of rl) {
    if (line.startsWith('#')) {
      continue; // Skip header lines
    }

    const columns = line.split(/\t|\s{2,}|\s+/);
    if (columns.length < 8) continue; // Ensure enough columns

    // 1. Extract rsID (ID column - index 2)
    const rsid = columns[2];
    if (!rsid || rsid === '.') continue; // Skip if no ID

    // 2. Extract GENE from INFO column (index 7)
    const info = columns[7];
    const geneMatch = info.match(/GENE=([^;]+)/);

    if (geneMatch && geneMatch[1]) {
      const gene = geneMatch[1];
      genes.add(gene);

      // 3. Extract Genotype (GT) - typically first field of first sample (index 9)
      // Implementation assumes single sample VCF for this hackathon
      let genotype = null;
      if (columns.length > 9) {
        const format = columns[8];
        const sampleData = columns[9];
        const gtIndex = format.split(':').indexOf('GT');
        if (gtIndex !== -1) {
          genotype = sampleData.split(':')[gtIndex];
        }
      }

      variants.push({
        gene: gene,
        rsid: rsid,
        genotype: genotype // Optional, adding for completeness if needed later
      });
    }
  }

  return {
    genes: Array.from(genes),
    variants: variants
  };
}

module.exports = { parseVCF };
