module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'eslint:recommended',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': ['error', { allow: ['error', 'warn'] }],
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
  ignorePatterns: ['**/__tests__/**'],
};
