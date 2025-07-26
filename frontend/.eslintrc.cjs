module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true // Add Node.js environment for config files
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'tailwind.config.js', 'postcss.config.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/no-unescaped-entities': 'warn', // Warn instead of error for unescaped entities
    // Use basic ESLint rules instead of TypeScript-specific ones
    'no-unused-vars': 'warn', // Warn instead of error for unused vars
    'no-undef': 'warn', // Warn instead of error for undefined variables
    'prefer-const': 'error',
    'no-var': 'error',
  },
}
