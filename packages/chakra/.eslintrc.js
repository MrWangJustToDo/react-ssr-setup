module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    '../../.eslintrc.js',
  ],
  settings: {
    react: {
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
