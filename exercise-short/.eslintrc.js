module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'jest',
  ],
  rules: {
    'linebreak-style': 0,
    'class-methods-use-this': 0,
    'no-useless-escape': 0,
    'no-cond-assign': 0,
    'prefer-destructuring': 0,
    'max-len': 0,
    'no-plusplus': 0,
    'react/no-array-index-key': 0,
    'max-classes-per-file': 0,
  },
};
