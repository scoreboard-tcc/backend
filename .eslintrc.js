module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:jsdoc/recommended',
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:jest/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: ['jsdoc', 'sonarjs', 'jest', 'import'],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'class-methods-use-this': 'off',
    'max-len': 'off',
    'no-return-await': 'off',
    'import/order': ['error', {
      groups: ['external', 'internal', 'object'],
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],
  },
};
