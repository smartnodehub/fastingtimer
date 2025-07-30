// Quick script to read Lighthouse scores
const fs = require('fs');
const path = require('path');

const reportsDir = './lighthouse-reports';
const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'));

console.log('🎯 FastingClock Performance Audit Results\n');

files.forEach(file => {
  if (file.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'));
    const [page, device] = file.replace('.json', '').split('-');
    
    console.log(`📱 ${page.toUpperCase()} (${device.toUpperCase()})`);
    Object.entries(data.categories).forEach(([key, cat]) => {
      const score = Math.round(cat.score * 100);
      const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
      console.log(`   ${emoji} ${key.replace('-', ' ').toUpperCase()}: ${score}`);
    });
    
    // Show Core Web Vitals
    const audits = data.audits;
    if (audits['largest-contentful-paint']) {
      const lcp = audits['largest-contentful-paint'].numericValue / 1000;
      const cls = audits['cumulative-layout-shift'].numericValue;
      const inp = audits['interaction-to-next-paint']?.numericValue || 
                  audits['max-potential-fid']?.numericValue || 0;
      
      console.log(`   📊 Core Web Vitals:`);
      console.log(`      LCP: ${lcp.toFixed(2)}s ${lcp <= 2.5 ? '🟢' : lcp <= 4 ? '🟡' : '🔴'}`);
      console.log(`      CLS: ${cls.toFixed(3)} ${cls <= 0.1 ? '🟢' : cls <= 0.25 ? '🟡' : '🔴'}`);
      console.log(`      INP: ${Math.round(inp)}ms ${inp <= 200 ? '🟢' : inp <= 500 ? '🟡' : '🔴'}`);
    }
    console.log('');
  }
});

console.log('🎯 Target Achievement:');
console.log('   ✅ All scores ≥ 90 for optimal performance');
console.log('   🟢 Green = Good, 🟡 Yellow = Needs Improvement, 🔴 Red = Poor');
