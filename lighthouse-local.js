#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouse(url, options = {}) {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const flags = {
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    ...options
  };

  const runnerResult = await lighthouse(url, flags);
  await chrome.kill();

  return runnerResult;
}

async function main() {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  const urls = [
    baseUrl,
    `${baseUrl}/blog`,
    `${baseUrl}/privacy`,
    `${baseUrl}/contact`
  ];

  console.log('🚦 Running Lighthouse performance audit...\n');

  const results = [];

  for (const url of urls) {
    console.log(`Testing: ${url}`);
    
    try {
      // Desktop test
      const desktopResult = await runLighthouse(url, {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        }
      });

      // Mobile test
      const mobileResult = await runLighthouse(url, {
        preset: 'mobile'
      });

      const urlPath = new URL(url).pathname || '/';
      
      results.push({
        url: urlPath,
        desktop: {
          performance: Math.round(desktopResult.lhr.categories.performance.score * 100),
          accessibility: Math.round(desktopResult.lhr.categories.accessibility.score * 100),
          bestPractices: Math.round(desktopResult.lhr.categories['best-practices'].score * 100),
          seo: Math.round(desktopResult.lhr.categories.seo.score * 100),
          lcp: Math.round(desktopResult.lhr.audits['largest-contentful-paint'].numericValue),
          cls: desktopResult.lhr.audits['cumulative-layout-shift'].numericValue.toFixed(3),
          fid: Math.round(desktopResult.lhr.audits['max-potential-fid'].numericValue)
        },
        mobile: {
          performance: Math.round(mobileResult.lhr.categories.performance.score * 100),
          accessibility: Math.round(mobileResult.lhr.categories.accessibility.score * 100),
          bestPractices: Math.round(mobileResult.lhr.categories['best-practices'].score * 100),
          seo: Math.round(mobileResult.lhr.categories.seo.score * 100),
          lcp: Math.round(mobileResult.lhr.audits['largest-contentful-paint'].numericValue),
          cls: mobileResult.lhr.audits['cumulative-layout-shift'].numericValue.toFixed(3),
          fid: Math.round(mobileResult.lhr.audits['max-potential-fid'].numericValue)
        }
      });

      console.log(`✅ Completed: ${url}\n`);
    } catch (error) {
      console.error(`❌ Failed: ${url} - ${error.message}\n`);
    }
  }

  // Generate report
  console.log('📊 Performance Report');
  console.log('====================\n');

  console.log('| Page | Device | Performance | Accessibility | Best Practices | SEO | LCP (ms) | CLS | FID (ms) |');
  console.log('|------|--------|-------------|---------------|----------------|-----|----------|-----|----------|');

  results.forEach(result => {
    const getIcon = (score) => score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
    
    // Desktop row
    const dPerf = getIcon(result.desktop.performance);
    const dA11y = getIcon(result.desktop.accessibility);
    const dBP = getIcon(result.desktop.bestPractices);
    const dSEO = getIcon(result.desktop.seo);
    
    console.log(`| ${result.url} | Desktop | ${dPerf} ${result.desktop.performance} | ${dA11y} ${result.desktop.accessibility} | ${dBP} ${result.desktop.bestPractices} | ${dSEO} ${result.desktop.seo} | ${result.desktop.lcp} | ${result.desktop.cls} | ${result.desktop.fid} |`);
    
    // Mobile row
    const mPerf = getIcon(result.mobile.performance);
    const mA11y = getIcon(result.mobile.accessibility);
    const mBP = getIcon(result.mobile.bestPractices);
    const mSEO = getIcon(result.mobile.seo);
    
    console.log(`| ${result.url} | Mobile | ${mPerf} ${result.mobile.performance} | ${mA11y} ${result.mobile.accessibility} | ${mBP} ${result.mobile.bestPractices} | ${mSEO} ${result.mobile.seo} | ${result.mobile.lcp} | ${result.mobile.cls} | ${result.mobile.fid} |`);
  });

  console.log('\n📋 Performance Targets:');
  console.log('- LCP: < 2.5s (Desktop), < 4s (Mobile)');
  console.log('- CLS: < 0.1');
  console.log('- FID: < 100ms (Desktop), < 300ms (Mobile)');
  console.log('- Performance Score: > 80 (Desktop), > 70 (Mobile)');
  console.log('- Accessibility Score: > 90');

  // Check if any targets are missed
  const failures = [];
  results.forEach(result => {
    if (result.desktop.performance < 80) failures.push(`${result.url} Desktop Performance: ${result.desktop.performance}`);
    if (result.mobile.performance < 70) failures.push(`${result.url} Mobile Performance: ${result.mobile.performance}`);
    if (result.desktop.accessibility < 90) failures.push(`${result.url} Desktop Accessibility: ${result.desktop.accessibility}`);
    if (result.mobile.accessibility < 90) failures.push(`${result.url} Mobile Accessibility: ${result.mobile.accessibility}`);
    if (result.desktop.lcp > 2500) failures.push(`${result.url} Desktop LCP: ${result.desktop.lcp}ms`);
    if (result.mobile.lcp > 4000) failures.push(`${result.url} Mobile LCP: ${result.mobile.lcp}ms`);
    if (parseFloat(result.desktop.cls) > 0.1) failures.push(`${result.url} Desktop CLS: ${result.desktop.cls}`);
    if (parseFloat(result.mobile.cls) > 0.1) failures.push(`${result.url} Mobile CLS: ${result.mobile.cls}`);
  });

  if (failures.length > 0) {
    console.log('\n❌ Performance targets not met:');
    failures.forEach(failure => console.log(`  - ${failure}`));
    process.exit(1);
  } else {
    console.log('\n✅ All performance targets met!');
  }

  // Save results to file
  const reportPath = path.join(__dirname, 'lighthouse-local-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runLighthouse };
