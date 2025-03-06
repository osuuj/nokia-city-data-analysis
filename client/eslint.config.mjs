// @ts-check

import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    // Target TypeScript and TSX files
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      // Extend recommended rules from @typescript-eslint
      ...ts.configs.recommended.rules,
      // Custom rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
      // Add more specific rules here if needed
      'no-console': 'warn', // Warn on console.log usage
      'no-debugger': 'error', // Disallow debugger statements
      semi: ['error', 'always'], // Enforce semicolons
      quotes: ['error', 'single'], // Enforce single quotes
    },
  },
  {
    // Ignore specific directories
    ignores: ['node_modules/', '.next/', 'dist/', 'out/', 'public/'],
  },
];
