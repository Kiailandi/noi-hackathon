module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    camelcase: 0,
    'import/prefer-default-export': 0,
    'dot-notation': [2, { allowPattern: '^[a-z]+(_[a-z]+)+$' }],
    'import/no-extraneous-dependencies': 0,
    'no-plusplus': 0,
    'comma-dangle': 0,
    'arrow-parens': 0,
    'object-curly-newline': 0,
    'prettier/prettier': 'error'
  }
};
