#!/usr/bin/env node

/**
 * Security script to audit NEXT_PUBLIC_ environment variables for potential issues
 *
 * This script checks:
 * 1. If any NEXT_PUBLIC_ variables contain sensitive naming patterns
 * 2. If any NEXT_PUBLIC_ variables aren't in our approved allowlist
 *
 * Run with: node scripts/check-env-vars.js
 */

const fs = require('node:fs');
const path = require('node:path');

// List of allowed public variables that are verified safe for client exposure
const ALLOWED_PUBLIC_VARS = [
  'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN', // Public Mapbox token for map rendering
  'NEXT_PUBLIC_API_BASE_URL', // Public API endpoint
  'NEXT_PUBLIC_API_VERSION', // API version identifier
  'NEXT_PUBLIC_ENVIRONMENT', // Current environment name
];

// Suspicious keywords that shouldn't appear in public variables
const SENSITIVE_KEYWORDS = [
  'secret',
  'password',
  'auth',
  'credential',
  'private',
  'apikey',
  'key',
  'cert',
  'token',
  'signature',
];

// Optional allowlist of exceptions (for special cases with justification)
const EXCEPTION_LIST = [
  'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN', // This is a public token, not a secret
];

// Check .env files for prohibited public vars
const ENV_FILES = ['.env', '.env.local', '.env.development', '.env.production', '.env.compose'];

console.log('🔍 Checking for sensitive public environment variables...');

let issues = 0;
let warnings = 0;

// Process all env files
for (const filename of ENV_FILES) {
  const filePath = path.resolve(process.cwd(), filename);

  if (!fs.existsSync(filePath)) {
    continue;
  }

  console.log(`\nChecking ${filename}...`);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  for (const [index, line] of lines.entries()) {
    // Skip comments or empty lines
    if (line.trim().startsWith('#') || !line.includes('=')) {
      continue;
    }

    const [key, value] = line.split('=', 2).map((part) => part.trim());

    if (key.startsWith('NEXT_PUBLIC_')) {
      // Check if it's in allowed list
      if (!ALLOWED_PUBLIC_VARS.includes(key)) {
        console.error(`❌ Line ${index + 1}: Unauthorized public env var: ${key}`);
        console.error('   Add to ALLOWED_PUBLIC_VARS list if this is intentional');
        issues++;
      }

      // Check for sensitive naming patterns
      const lowercaseKey = key.toLowerCase();
      const matchedKeywords = SENSITIVE_KEYWORDS.filter((keyword) =>
        lowercaseKey.includes(keyword.toLowerCase()),
      );

      if (matchedKeywords.length > 0 && !EXCEPTION_LIST.includes(key)) {
        console.warn(`⚠️ Line ${index + 1}: Potentially sensitive public env var: ${key}`);
        console.warn(`   Contains sensitive keywords: ${matchedKeywords.join(', ')}`);
        warnings++;
      }

      // Check for potentially leaked values in committed files
      // (Don't log the actual value, just mention it exists)
      if (value && value.length > 0 && filename !== '.env.example') {
        console.warn(`⚠️ Line ${index + 1}: ${key} has a hardcoded value`);
        console.warn('   Environment values should be set at runtime, not in source control');
        warnings++;
      }
    }
  }
}

// Summary
console.log('\n--- Summary ---');
if (issues > 0 || warnings > 0) {
  console.log(`Found ${issues} security issues and ${warnings} warnings`);
  if (issues > 0) {
    console.error('❌ Security check failed!');
    process.exit(1);
  } else {
    console.warn('⚠️ Security check passed with warnings');
    process.exit(0);
  }
} else {
  console.log('✅ All public environment variables pass security checks');
}
