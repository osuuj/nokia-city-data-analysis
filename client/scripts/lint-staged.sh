#!/bin/sh

echo "🔍 Running ESLint..."
npx eslint --fix "client/**/*.{js,jsx,ts,tsx}"

echo "🎨 Running Prettier..."
npx prettier --write "client/**/*.{js,jsx,ts,tsx,css,md}"

echo "✅ Linting and formatting complete!"