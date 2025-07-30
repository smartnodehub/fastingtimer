#!/usr/bin/env node

/**
 * Helper script to gather the required information for GitHub secrets
 * Run this script to get the values you need to set up in GitHub Actions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Lighthouse CI Setup Helper\n');
console.log('This script will help you gather the information needed for GitHub secrets.\n');

// Check if we're in a Vercel project
console.log('📋 Required GitHub Secrets:');
console.log('==========================\n');

console.log('1. VERCEL_TOKEN');
console.log('   🔗 Get from: https://vercel.com/account/tokens');
console.log('   📝 Create a new token with appropriate scope\n');

console.log('2. VERCEL_ORG_ID');
console.log('3. VERCEL_PROJECT_ID');

try {
  // Try to get Vercel project info if available
  if (fs.existsSync('.vercel/project.json')) {
    const projectInfo = JSON.parse(fs.readFileSync('.vercel/project.json', 'utf8'));
    console.log('   ✅ Found in .vercel/project.json:');
    console.log(`   📋 VERCEL_ORG_ID: ${projectInfo.orgId}`);
    console.log(`   📋 VERCEL_PROJECT_ID: ${projectInfo.projectId}\n`);
  } else {
    console.log('   ❓ Run `vercel` in your project directory to link it');
    console.log('   ❓ Or check your Vercel dashboard for these values\n');
  }
} catch (error) {
  console.log('   ❓ Could not read Vercel project info');
  console.log('   ❓ Link your project with `vercel` command\n');
}

console.log('4. LHCI_GITHUB_APP_TOKEN (Optional)');
console.log('   📝 Use your existing GITHUB_TOKEN or create a personal access token');
console.log('   🔗 Create at: https://github.com/settings/tokens\n');

console.log('🚀 Setup Steps:');
console.log('===============\n');
console.log('1. Go to your GitHub repository');
console.log('2. Navigate to Settings > Secrets and variables > Actions');
console.log('3. Click "New repository secret" for each secret above');
console.log('4. Add the secret name and value\n');

console.log('🧪 Testing:');
console.log('===========\n');
console.log('After setting up secrets, test locally:');
console.log('• npm install');
console.log('• npm run build');
console.log('• npm start');
console.log('• npm run lighthouse (in another terminal)\n');

console.log('📖 For detailed setup instructions, see: LIGHTHOUSE_CI_SETUP.md');

// Check package.json for required dependencies
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['@lhci/cli', 'lighthouse', 'chrome-launcher'];
const missingDeps = requiredDeps.filter(dep => 
  !packageJson.devDependencies || !packageJson.devDependencies[dep]
);

if (missingDeps.length > 0) {
  console.log('\n⚠️  Missing dependencies:');
  console.log(`   Run: npm install --save-dev ${missingDeps.join(' ')}`);
} else {
  console.log('\n✅ All required dependencies are installed');
}

console.log('\n🎯 Performance Targets:');
console.log('=======================');
console.log('Desktop: Performance ≥80, LCP ≤2.5s, CLS ≤0.1');
console.log('Mobile:  Performance ≥70, LCP ≤4.0s, CLS ≤0.1');
console.log('Both:    Accessibility ≥90, SEO ≥90');
