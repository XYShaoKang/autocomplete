module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
    jest: {
      version: require('jest/package.json').version,
    },
  },

  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],

    // 当启用新的 JSX 转换时,可以关闭下面两条规则
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    'react/prop-types': 'off',
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],

    'react/no-unknown-property': ['error', { ignore: ['css'] }],
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: [
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
        'plugin:jest/all',
        'plugin:jest-extended/all',
        'plugin:jest-formatting/recommended',
      ],
      rules: {
        'jest/no-hooks': 'warn',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': ['warn'],
        '@typescript-eslint/explicit-member-accessibility': ['error'],
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/ban-types': [
          'error',
          {
            extendDefaults: true,
            types: {
              '{}': false,
            },
          },
        ],
      },
    },
  ],
}
