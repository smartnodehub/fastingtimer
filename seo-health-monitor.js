#!/usr/bin/env node

/**
 * Search Console Health Monitor
 * Checks various SEO health indicators
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DOMAIN = 'www.fastingclock.com';
const BASE_URL = `https://${DOMAIN}`;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if URL is accessible and returns proper status
function checkURL(url, expectedStatus = 200) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const request = client.get(url, (response) => {
      resolve({
        url,
        status: response.statusCode,
        success: response.statusCode === expectedStatus,
        headers: response.headers
      });
    });
    
    request.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

// Check essential pages
async function checkEssentialPages() {
  log('🔍 Checking essential pages accessibility...', 'blue');
  
  const essentialPages = [
    `${BASE_URL}/`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/blog/all`,
    `${BASE_URL}/privacy`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/sitemap.xml`,
    `${BASE_URL}/robots.txt`
  ];
  
  const results = [];
  
  for (const url of essentialPages) {
    const result = await checkURL(url);
    results.push(result);
    
    if (result.success) {
      log(`✅ ${url}`, 'green');
    } else {
      log(`❌ ${url} - ${result.status} ${result.error || ''}`, 'red');
    }
  }
  
  return results;
}

// Check HTTPS redirect
async function checkHTTPSRedirect() {
  log('\n🔒 Checking HTTPS redirect...', 'blue');
  
  const httpUrl = `http://${DOMAIN}/`;
  const result = await checkURL(httpUrl, 301);
  
  if (result.success || result.status === 302) {
    log('✅ HTTP to HTTPS redirect working', 'green');
    return true;
  } else {
    log(`❌ HTTP redirect issue - Status: ${result.status}`, 'red');
    return false;
  }
}

// Check www redirect
async function checkWWWRedirect() {
  log('\n🌐 Checking www redirect...', 'blue');
  
  const nonWwwUrl = 'https://fastingclock.com/';
  const result = await checkURL(nonWwwUrl, 301);
  
  if (result.success || result.status === 302) {
    log('✅ Non-www to www redirect working', 'green');
    return true;
  } else {
    log(`❌ WWW redirect issue - Status: ${result.status}`, 'red');
    return false;
  }
}

// Check meta tags on homepage
async function checkMetaTags() {
  log('\n🏷️  Checking meta tags...', 'blue');
  
  return new Promise((resolve) => {
    const request = https.get(`${BASE_URL}/`, (response) => {
      let html = '';
      
      response.on('data', (chunk) => {
        html += chunk;
      });
      
      response.on('end', () => {
        const checks = [
          {
            name: 'Title tag',
            test: /<title[^>]*>([^<]+)<\/title>/i.test(html),
            extract: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
          },
          {
            name: 'Meta description',
            test: /<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i.test(html),
            extract: html.match(/content=["\']([^"\']+)["\'][^>]*>/i)?.[1]
          },
          {
            name: 'Canonical URL',
            test: /<link[^>]*rel=["\']canonical["\'][^>]*>/i.test(html)
          },
          {
            name: 'Open Graph title',
            test: /<meta[^>]*property=["\']og:title["\'][^>]*>/i.test(html)
          },
          {
            name: 'Open Graph description',
            test: /<meta[^>]*property=["\']og:description["\'][^>]*>/i.test(html)
          },
          {
            name: 'Viewport meta',
            test: /<meta[^>]*name=["\']viewport["\'][^>]*>/i.test(html)
          }
        ];
        
        const results = [];
        checks.forEach(check => {
          if (check.test) {
            log(`✅ ${check.name}${check.extract ? ': ' + check.extract.substring(0, 60) + '...' : ''}`, 'green');
            results.push({ name: check.name, status: 'pass', content: check.extract });
          } else {
            log(`❌ ${check.name} missing`, 'red');
            results.push({ name: check.name, status: 'fail' });
          }
        });
        
        resolve(results);
      });
    });
    
    request.on('error', () => {
      log('❌ Error checking meta tags', 'red');
      resolve([]);
    });
  });
}

// Check structured data
async function checkStructuredData() {
  log('\n📋 Checking structured data...', 'blue');
  
  return new Promise((resolve) => {
    const request = https.get(`${BASE_URL}/`, (response) => {
      let html = '';
      
      response.on('data', (chunk) => {
        html += chunk;
      });
      
      response.on('end', () => {
        const jsonLdScripts = html.match(/<script[^>]*type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/gis);
        
        if (jsonLdScripts && jsonLdScripts.length > 0) {
          log(`✅ Found ${jsonLdScripts.length} JSON-LD structured data block(s)`, 'green');
          
          jsonLdScripts.forEach((script, index) => {
            try {
              const jsonContent = script.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
              const data = JSON.parse(jsonContent);
              log(`   📄 Block ${index + 1}: ${data['@type'] || 'Unknown type'}`, 'cyan');
            } catch (e) {
              log(`   ❌ Block ${index + 1}: Invalid JSON`, 'red');
            }
          });
          
          resolve(true);
        } else {
          log('❌ No structured data found', 'red');
          resolve(false);
        }
      });
    });
    
    request.on('error', () => {
      log('❌ Error checking structured data', 'red');
      resolve(false);
    });
  });
}

// Check page load performance
async function checkPageSpeed() {
  log('\n⚡ Checking page load performance...', 'blue');
  
  const start = Date.now();
  const result = await checkURL(`${BASE_URL}/`);
  const loadTime = Date.now() - start;
  
  if (result.success) {
    log(`⏱️  Page load time: ${loadTime}ms`, loadTime < 2000 ? 'green' : loadTime < 4000 ? 'yellow' : 'red');
    
    // Check if gzip/compression is enabled
    const encoding = result.headers['content-encoding'];
    if (encoding && (encoding.includes('gzip') || encoding.includes('br'))) {
      log('✅ Content compression enabled', 'green');
    } else {
      log('❌ Content compression not detected', 'red');
    }
    
    return { loadTime, compressed: !!encoding };
  } else {
    log('❌ Could not measure page speed', 'red');
    return { loadTime: null, compressed: false };
  }
}

// Generate comprehensive report
function generateHealthReport(results) {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    domain: DOMAIN,
    base_url: BASE_URL,
    checks: results
  };
  
  const reportPath = path.join(__dirname, 'seo-health-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Health report saved to: ${reportPath}`, 'blue');
  
  // Calculate overall score
  const totalChecks = Object.values(results).flat().length;
  const passedChecks = Object.values(results).flat().filter(check => 
    check === true || check.success === true || check.status === 'pass'
  ).length;
  
  const score = Math.round((passedChecks / totalChecks) * 100);
  log(`\n📊 Overall SEO Health Score: ${score}%`, score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red');
  
  return report;
}

// Main monitoring function
async function monitorSEOHealth() {
  log('🚀 Starting SEO health monitoring...', 'blue');
  console.log('=' .repeat(60));
  
  const results = {};
  
  try {
    results.essentialPages = await checkEssentialPages();
    results.httpsRedirect = await checkHTTPSRedirect();
    results.wwwRedirect = await checkWWWRedirect();
    results.metaTags = await checkMetaTags();
    results.structuredData = await checkStructuredData();
    results.pageSpeed = await checkPageSpeed();
    
    console.log('\n' + '=' .repeat(60));
    generateHealthReport(results);
    
  } catch (error) {
    log(`\n💥 Monitoring failed: ${error.message}`, 'red');
  }
  
  return results;
}

// Print next steps
function printNextSteps() {
  log('\n📝 Next Steps for Search Console:', 'blue');
  console.log('1. Submit sitemap to Google Search Console');
  console.log('2. Submit sitemap to Bing Webmaster Tools');
  console.log('3. Set up email alerts in both platforms');
  console.log('4. Monitor this health report weekly');
  console.log('5. Check for manual actions or penalties');
  console.log('\n🔗 Useful Links:');
  console.log('Google Search Console: https://search.google.com/search-console');
  console.log('Bing Webmaster Tools: https://www.bing.com/webmasters');
  console.log('Rich Results Test: https://search.google.com/test/rich-results');
  console.log('PageSpeed Insights: https://pagespeed.web.dev/');
}

// Run monitoring if called directly
if (require.main === module) {
  monitorSEOHealth().then(() => {
    printNextSteps();
  }).catch((error) => {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { monitorSEOHealth };
