#!/bin/bash

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx|css|md)$' || echo "")

if [ -z "$STAGED_FILES" ]; then
  echo "✅ No relevant files changed. Skipping linting."
  exit 0
fi

echo "🔍 Running linters and formatters on staged files..."

# Run ESLint on JS/TS files
JS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(js|jsx|ts|tsx)$' || echo "")
if [ -n "$JS_FILES" ]; then
  echo "📌 Running ESLint on: $JS_FILES"
  npx eslint --fix $JS_FILES
  if [ $? -ne 0 ]; then
    echo "❌ ESLint failed. Fix issues before committing."
    exit 1
  fi
else
  echo "✅ No JS/TS files to lint."
fi

# Run Prettier on all files
echo "🎨 Running Prettier on: $STAGED_FILES"
npx prettier --write $STAGED_FILES
if [ $? -ne 0 ]; then
  echo "❌ Prettier failed. Fix issues before committing."
  exit 1
fi

# Run Stylelint on CSS files
CSS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(css|scss)$' || echo "")
if [ -n "$CSS_FILES" ]; then
  echo "🎨 Running Stylelint on: $CSS_FILES"
  npx stylelint --fix $CSS_FILES
  if [ $? -ne 0 ]; then
    echo "❌ Stylelint failed. Fix issues before committing."
    exit 1
  fi
else
  echo "✅ No CSS/SCSS files to lint."
fi

echo "✅ All linting and formatting checks passed!"
exit 0
