module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    indent: ['off'], // To let prettier do its job
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'warn',
    'no-extra-semi': 'error',
    'no-return-await': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prettier/prettier': 'error',
    'react/jsx-indent': ['error', 2, { checkAttributes: false, indentLogicalExpressions: false }],
    'react/jsx-no-bind': ['warn'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['lib/**/*'],
  overrides: [
    {
      files: [
        // Your TypeScript files extension
        '*.ts',
        '*.tsx',
      ],
      extends: [
        // You should extend TypeScript plugins here, instead of extending them outside the `overrides`.
        // If you don't want to extend any rules, you don't need an `extends` attribute.
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      rules: {
        'no-shadow': 'off', // Must set to false according to @typescript-eslint/no-shadow
        '@typescript-eslint/adjacent-overload-signatures': ['warn'],
        '@typescript-eslint/explicit-function-return-type': ['error'],
        '@typescript-eslint/explicit-module-boundary-types': ['error'],
        '@typescript-eslint/no-invalid-void-type': ['warn'],
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unsafe-argument': ['off'], // I don't know why some exported packages trigger this rule
        '@typescript-eslint/no-unsafe-assignment': ['off'], // I don't know why some exported packages trigger this rule
        '@typescript-eslint/no-unsafe-call': ['off'], // I don't know why some exported packages trigger this rule
        '@typescript-eslint/no-unsafe-member-access': ['off'], // I don't know why some exported packages trigger this rule
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_.*_$', varsIgnorePattern: '^_.*_$' }],
      },
    },
  ],
};
