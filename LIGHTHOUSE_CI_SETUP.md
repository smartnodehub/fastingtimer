# Lighthouse CI Setup Guide

This guide explains how to set up and use the automated Lighthouse CI pipeline for performance monitoring.

## Overview

The Lighthouse CI setup includes:
- **Automated GitHub Actions workflow** that runs on every PR
- **Performance targets** that must be met for the build to pass
- **Both desktop and mobile testing**
- **PR comments** with performance results
- **Local testing scripts** for development

## Performance Targets

### Desktop
- **Performance Score:** ≥ 80
- **Accessibility Score:** ≥ 90
- **Best Practices Score:** ≥ 80
- **SEO Score:** ≥ 90
- **Largest Contentful Paint (LCP):** ≤ 2.5s
- **Cumulative Layout Shift (CLS):** ≤ 0.1
- **First Input Delay (FID):** ≤ 100ms

### Mobile
- **Performance Score:** ≥ 70
- **Accessibility Score:** ≥ 90
- **Best Practices Score:** ≥ 80
- **SEO Score:** ≥ 90
- **Largest Contentful Paint (LCP):** ≤ 4.0s
- **Cumulative Layout Shift (CLS):** ≤ 0.1
- **First Input Delay (FID):** ≤ 300ms

## Required GitHub Secrets

Set up these secrets in your GitHub repository (Settings > Secrets and variables > Actions):

### Vercel Integration
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

To get these values:
1. **VERCEL_TOKEN:** Go to [Vercel Dashboard > Settings > Tokens](https://vercel.com/account/tokens) and create a new token
2. **VERCEL_ORG_ID:** Run `vercel env ls` in your project or check your Vercel project settings
3. **VERCEL_PROJECT_ID:** Found in your Vercel project settings URL or by running `vercel env ls`

### Lighthouse CI (Optional)
```
LHCI_GITHUB_APP_TOKEN=your_github_token
```

This enables PR comments and detailed reporting. You can use the default `GITHUB_TOKEN` or create a personal access token.

## Local Development

### Prerequisites
Install the necessary dependencies:
```bash
npm install
```

This will install:
- `@lhci/cli` - Lighthouse CI command line tool
- `lighthouse` - Core Lighthouse library
- `chrome-launcher` - For headless Chrome automation

### Running Lighthouse Locally

#### Quick Test
Test your local development server:
```bash
# Start your dev server first
npm run dev

# In another terminal, run lighthouse
npm run lighthouse
```

#### Test Specific URL
```bash
node lighthouse-local.js http://localhost:3000
```

#### Test Production Build
```bash
npm run build
npm start
npm run lighthouse
```

### Using Lighthouse CI CLI

Run the full CI suite locally:
```bash
# Desktop configuration
npx lhci autorun --config=lighthouserc.json

# Mobile configuration
npx lhci autorun --config=lighthouserc.mobile.json
```

## GitHub Actions Workflow

The workflow (`.github/workflows/lighthouse-ci.yml`) automatically:

1. **Triggers on PR events:** opened, synchronize, reopened
2. **Builds the project:** Uses Node.js 18 and npm ci
3. **Deploys to Vercel preview:** Creates a temporary preview deployment
4. **Runs Lighthouse tests:** Both desktop and mobile configurations
5. **Validates performance:** Fails the build if targets aren't met
6. **Comments on PR:** Adds performance results as a comment

### Workflow Steps

```yaml
# 1. Checkout and setup
- Checkout code
- Setup Node.js 18
- Install dependencies
- Build project

# 2. Deploy preview
- Deploy to Vercel preview
- Wait for deployment to be ready

# 3. Run tests
- Run Lighthouse CI (Desktop)
- Run Lighthouse CI (Mobile)

# 4. Report results
- Comment PR with results
```

## Configuration Files

### `lighthouserc.json` (Desktop)
- **Throttling:** Simulates fast 3G connection
- **Device:** Desktop viewport and user agent
- **Runs:** 3 audits per URL (median result used)
- **Strict performance targets** for desktop experience

### `lighthouserc.mobile.json` (Mobile)
- **Throttling:** Simulates slow 3G connection
- **Device:** Mobile viewport and user agent
- **More lenient performance targets** accounting for mobile constraints

## Pages Tested

The CI automatically tests these pages:
- **Homepage:** `/`
- **Blog index:** `/blog`
- **Privacy page:** `/privacy`

You can add more URLs by editing the `urls` section in the workflow file.

## Interpreting Results

### Score Meanings
- **🟢 90-100:** Good
- **🟡 50-89:** Needs improvement
- **🔴 0-49:** Poor

### Core Web Vitals
- **LCP (Largest Contentful Paint):** Time until the largest content element is rendered
- **CLS (Cumulative Layout Shift):** Visual stability measure
- **FID (First Input Delay):** Interactivity measure

### What Causes Build Failures

The build will fail if ANY of these conditions are met:
- Performance score below target
- Accessibility score below 90
- LCP exceeds target time
- CLS exceeds 0.1
- FID exceeds target time

## Troubleshooting

### Common Issues

#### 1. Vercel Deployment Fails
- Verify all Vercel secrets are correctly set
- Check that your Vercel project is properly configured
- Ensure the preview deployment succeeds manually

#### 2. Lighthouse Tests Timeout
- The workflow waits 30 seconds after deployment
- Large pages might need more time - increase the wait time
- Check if the preview URL is accessible

#### 3. Performance Targets Not Met
- Review the specific metrics that failed
- Use local testing to identify performance bottlenecks
- Consider optimizing images, CSS, and JavaScript

#### 4. False Positives
- Lighthouse can have variance between runs
- The configuration uses 3 runs and takes the median
- Very borderline scores might occasionally fail

### Local Testing Tips

1. **Test with production build:** Always use `npm run build && npm start`
2. **Clear cache:** Use incognito mode or clear browser cache
3. **Consistent environment:** Close other applications that might affect performance
4. **Multiple runs:** Run tests multiple times to account for variance

## Customization

### Adjusting Targets
Edit the `assertions` section in `lighthouserc.json` or `lighthouserc.mobile.json`:

```json
{
  "assertions": {
    "categories:performance": ["error", {"minScore": 0.85}],
    "largest-contentful-paint": ["error", {"maxNumericValue": 2000}]
  }
}
```

### Adding More URLs
Add URLs to the workflow file:

```yaml
urls: |
  ${{ steps.vercel-deploy.outputs.preview-url }}
  ${{ steps.vercel-deploy.outputs.preview-url }}/blog
  ${{ steps.vercel-deploy.outputs.preview-url }}/new-page
```

### Changing Audit Rules
Modify the `assertions` section to:
- Change error to warning: `"error"` → `"warn"`
- Adjust thresholds: `{"maxNumericValue": 2500}` → `{"maxNumericValue": 3000}`
- Add new audits: See [Lighthouse documentation](https://web.dev/lighthouse-ci/)

## Integration with Development Workflow

### Pre-commit Hooks
Add to your pre-commit workflow:
```bash
npm run lighthouse
```

### CI/CD Pipeline
The Lighthouse CI integrates seamlessly with:
- Pull request reviews
- Deployment gates
- Performance monitoring
- Regression detection

This setup ensures that performance regressions are caught early and that your web application maintains high performance standards.
