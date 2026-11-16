import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

const inputs = {
  main: resolve(__dirname, 'index.html'),
  privacy: resolve(__dirname, 'privacy-policy.html'),
  terms: resolve(__dirname, 'terms-and-conditions.html'),
  contact: resolve(__dirname, 'contact-us.html'),
  neetMarksVsRank: resolve(__dirname, 'neet-marks-vs-rank-2026.html'),
  jeeMainMarksVsPercentile: resolve(__dirname, 'jee-main-marks-vs-percentile-2026.html'),
  aiimsMbbsCutoff: resolve(__dirname, 'aiims-mbbs-cutoff-2026.html')
};

// Dynamically auto-register all generated pSEO cutoff pages
const cutoffsDir = resolve(__dirname, 'cutoffs');
if (fs.existsSync(cutoffsDir)) {
  const cutoffFiles = fs.readdirSync(cutoffsDir).filter(f => f.endsWith('.html'));
  for (const file of cutoffFiles) {
    const key = 'cutoff_' + file.replace('.html', '').replace(/[^a-zA-Z0-9_]/g, '_');
    inputs[key] = resolve(cutoffsDir, file);
  }
}

export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: inputs
    }
  }
});
