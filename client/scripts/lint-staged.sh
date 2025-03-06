#!/bin/bash

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM) || { echo "❌ Failed to get staged files."; exit 1; }

if [ -z "$STAGED_FILES" ]; then
  echo "✅ No relevant files changed. Skipping linting."
  exit 0
fi

echo "🔍 Running linters and formatters on staged files..."

# Run ESLint on JS/TS files
JS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(js|jsx|ts|tsx)$' || echo "")
if [ -n "$JS_FILES" ]; then
  if [ -f "client/eslint.config.mjs" ]; then
    echo "📌 Running ESLint on: $JS_FILES"
    npx eslint --config client/eslint.config.mjs --fix $JS_FILES
    if [ $? -ne 0 ]; then
      echo "❌ ESLint failed. Fix issues before committing."
      exit 1
    fi
  else
    echo "⚠️ Warning: ESLint config not found. Skipping ESLint."
  fi
else
  echo "✅ No JS/TS files to lint."
fi

# Run Prettier on relevant files
PRETTIER_FILES=$(echo "$STAGED_FILES" | grep -E '\.(js|jsx|ts|tsx|css|md|json|html)$' || echo "")
if [ -n "$PRETTIER_FILES" ]; then
  echo "🎨 Running Prettier on: $PRETTIER_FILES"
  npx prettier --write $PRETTIER_FILES
  if [ $? -ne 0 ]; then
    echo "❌ Prettier failed. Fix issues before committing."
    exit 1
  fi
else
  echo "✅ No files to format."
fi

# Run Stylelint on CSS/SCSS files
CSS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(css|scss)$' || echo "")
if [ -n "$CSS_FILES" ]; then
  echo "🎨 Running Stylelint on: $CSS_FILES"
  npx stylelint --config client/stylelint.config.js --fix $CSS_FILES
  if [ $? -ne 0 ]; then
    echo "❌ Stylelint failed. Fix issues before committing."
    exit 1
  fi
else
  echo "✅ No CSS/SCSS files to lint."
fi

echo "✅ All linting and formatting checks passed!"
exit 0
