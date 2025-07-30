#!/usr/bin/env node

/**
 * Performance Audit Script for FastingClock
 * 
 * This script can be used to run automated performance tests
 * Install with: npm install -g lighthouse
 * Run with: node performance-audit.js
 */

const fs = require('fs');
const { execSync } = require('child_process');

const SITE_URL = 'http://localhost:3000';
const OUTPUT_DIR = './lighthouse-reports';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

const pages = [
  { name: 'homepage', url: SITE_URL },
  { name: 'blog', url: `${SITE_URL}/blog` },
  { name: 'blog-post', url: `${SITE_URL}/blog/getting-started-16-8-intermittent-fasting` },
];

const devices = ['desktop', 'mobile'];

console.log('🚀 Starting FastingClock Performance Audit...\n');

devices.forEach(device => {
  console.log(`📱 Testing ${device} performance...\n`);
  
  pages.forEach(page => {
    console.log(`  ⏱️  Auditing ${page.name} (${device})...`);
    
    const outputPath = `${OUTPUT_DIR}/${page.name}-${device}.html`;
    const jsonPath = `${OUTPUT_DIR}/${page.name}-${device}.json`;
    
    // Use different command format for mobile vs desktop
    let command;
    if (device === 'mobile') {
      command = `lighthouse ${page.url} --output=html --output=json --output-path=${outputPath} --emulated-form-factor=mobile --throttling-method=simulate --chrome-flags="--headless"`;
    } else {
      command = `lighthouse ${page.url} --output=html --output=json --output-path=${outputPath} --preset=${device} --chrome-flags="--headless"`;
    }
    
    try {
      execSync(command, { stdio: 'pipe' });
      console.log(`  ✅ Report saved: ${outputPath}`);
      
      // Also save JSON for programmatic analysis
      let jsonCommand;
      if (device === 'mobile') {
        jsonCommand = `lighthouse ${page.url} --output=json --output-path=${jsonPath} --emulated-form-factor=mobile --throttling-method=simulate --chrome-flags="--headless"`;
      } else {
        jsonCommand = `lighthouse ${page.url} --output=json --output-path=${jsonPath} --preset=${device} --chrome-flags="--headless"`;
      }
      execSync(jsonCommand, { stdio: 'pipe' });
      console.log(`  📊 JSON data: ${jsonPath}`);
    } catch (error) {
      console.log(`  ❌ Error auditing ${page.name}: ${error.message}`);
    }
  });
  
  console.log('');
});

console.log('📊 Performance audit complete!');
console.log(`📁 Reports saved in: ${OUTPUT_DIR}`);
console.log('\n🎯 Target Scores:');
console.log('   Performance: ≥ 90');
console.log('   Accessibility: ≥ 90');
console.log('   Best Practices: ≥ 90');
console.log('   SEO: ≥ 90');
console.log('\n📈 Core Web Vitals Targets:');
console.log('   LCP (Largest Contentful Paint): ≤ 2.5s');
console.log('   CLS (Cumulative Layout Shift): ≤ 0.1');
console.log('   INP (Interaction to Next Paint): ≤ 200ms');
console.log('\n💡 Tip: Check GA4 → Events → Core Web Vitals for real user data!');
