import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import globals from 'globals'
import prettierConfig from 'eslint-config-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
})

export default [
  // 1. Global Ignores (This must be its own object with ONLY the ignores key)
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '**/webpack.*.cjs']
  },

  // 2. Base Standard Configuration
  ...compat.extends('eslint-config-standard'),

  // 3. Project-Specific Overrides
  {
    // Adding files: ['**/*.js'] ensures these settings apply to your JS files
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      // Example: Standard might be too strict on 'no-console' for your taste
      // 'no-console': 'warn',
    }
  },

  // 4. Prettier (Must be absolutely last)
  prettierConfig
]
