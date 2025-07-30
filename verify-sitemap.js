#!/usr/bin/env node

/**
 * Sitemap Verification Script
 * Validates sitemap accessibility and structure
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SITEMAP_URL = 'https://www.fastingclock.com/sitemap.xml';
const LOCAL_SITEMAP = path.join(__dirname, 'public', 'sitemap.xml');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if sitemap is accessible online
function checkSitemapAccessibility() {
  return new Promise((resolve, reject) => {
    log('🔍 Checking sitemap accessibility...', 'blue');
    
    const request = https.get(SITEMAP_URL, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          log('✅ Sitemap is accessible online', 'green');
          resolve(data);
        } else {
          log(`❌ Sitemap returned status code: ${response.statusCode}`, 'red');
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      });
    });
    
    request.on('error', (error) => {
      log(`❌ Error accessing sitemap: ${error.message}`, 'red');
      reject(error);
    });
    
    request.setTimeout(10000, () => {
      log('❌ Sitemap request timed out', 'red');
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Validate XML structure
function validateXMLStructure(xmlContent) {
  log('🔍 Validating XML structure...', 'blue');
  
  const checks = [
    {
      test: xmlContent.includes('<?xml version="1.0" encoding="UTF-8"?>'),
      message: 'XML declaration'
    },
    {
      test: xmlContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'),
      message: 'Sitemap namespace'
    },
    {
      test: xmlContent.includes('</urlset>'),
      message: 'Closing urlset tag'
    },
    {
      test: xmlContent.includes('<loc>https://www.fastingclock.com/</loc>') || xmlContent.includes('<loc>https://fastingclock.com</loc>'),
      message: 'Homepage URL'
    }
  ];
  
  let valid = true;
  checks.forEach(check => {
    if (check.test) {
      log(`✅ ${check.message}`, 'green');
    } else {
      log(`❌ ${check.message}`, 'red');
      valid = false;
    }
  });
  
  return valid;
}

// Count URLs in sitemap
function countURLs(xmlContent) {
  const urlMatches = xmlContent.match(/<url>/g);
  const count = urlMatches ? urlMatches.length : 0;
  log(`📊 Found ${count} URLs in sitemap`, 'blue');
  return count;
}

// Check for duplicate URLs
function checkDuplicateURLs(xmlContent) {
  log('🔍 Checking for duplicate URLs...', 'blue');
  
  const locMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g);
  if (!locMatches) {
    log('❌ No URLs found in sitemap', 'red');
    return false;
  }
  
  const urls = locMatches.map(match => match.replace(/<\/?loc>/g, ''));
  const uniqueUrls = new Set(urls);
  
  if (urls.length === uniqueUrls.size) {
    log('✅ No duplicate URLs found', 'green');
    return true;
  } else {
    log(`❌ Found ${urls.length - uniqueUrls.size} duplicate URLs`, 'red');
    return false;
  }
}

// Check robots.txt for sitemap reference
function checkRobotsTxt() {
  return new Promise((resolve, reject) => {
    log('🔍 Checking robots.txt for sitemap reference...', 'blue');
    
    const robotsUrl = 'https://www.fastingclock.com/robots.txt';
    const request = https.get(robotsUrl, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          if (data.includes('Sitemap: https://www.fastingclock.com/sitemap.xml')) {
            log('✅ Sitemap properly referenced in robots.txt', 'green');
            resolve(true);
          } else {
            log('❌ Sitemap not found in robots.txt', 'red');
            resolve(false);
          }
        } else {
          log(`❌ robots.txt returned status code: ${response.statusCode}`, 'red');
          resolve(false);
        }
      });
    });
    
    request.on('error', (error) => {
      log(`❌ Error accessing robots.txt: ${error.message}`, 'red');
      resolve(false);
    });
  });
}

// Generate verification report
function generateReport(results) {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    sitemap_url: SITEMAP_URL,
    results
  };
  
  const reportPath = path.join(__dirname, 'sitemap-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`📄 Report saved to: ${reportPath}`, 'blue');
}

// Main verification function
async function verifySitemap() {
  log('🚀 Starting sitemap verification...', 'blue');
  console.log('=' .repeat(50));
  
  const results = {
    accessible: false,
    valid_xml: false,
    url_count: 0,
    no_duplicates: false,
    robots_txt_ok: false,
    overall_status: 'FAIL'
  };
  
  try {
    // Check accessibility
    const xmlContent = await checkSitemapAccessibility();
    results.accessible = true;
    
    // Validate XML structure
    results.valid_xml = validateXMLStructure(xmlContent);
    
    // Count URLs
    results.url_count = countURLs(xmlContent);
    
    // Check for duplicates
    results.no_duplicates = checkDuplicateURLs(xmlContent);
    
    // Check robots.txt
    results.robots_txt_ok = await checkRobotsTxt();
    
    // Overall status
    if (results.accessible && results.valid_xml && results.no_duplicates && results.robots_txt_ok) {
      results.overall_status = 'PASS';
      log('\n🎉 All checks passed! Sitemap is ready for search engines.', 'green');
    } else {
      log('\n⚠️  Some issues found. Please review the results above.', 'yellow');
    }
    
  } catch (error) {
    log(`\n💥 Verification failed: ${error.message}`, 'red');
  }
  
  console.log('=' .repeat(50));
  generateReport(results);
  
  return results;
}

// Search Console submission URLs (for reference)
function printSubmissionURLs() {
  log('\n📝 Search Engine Submission URLs:', 'blue');
  console.log('Google Search Console: https://search.google.com/search-console');
  console.log('Bing Webmaster Tools: https://www.bing.com/webmasters');
  console.log('Yandex Webmaster: https://webmaster.yandex.com/');
  console.log('\nYour sitemap URL: ' + SITEMAP_URL);
}

// Run verification if called directly
if (require.main === module) {
  verifySitemap().then(() => {
    printSubmissionURLs();
  }).catch((error) => {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { verifySitemap };
