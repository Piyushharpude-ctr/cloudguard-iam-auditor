export default [
  {
    ignores: [
      'node_modules/**'
    ]
  },

  {
    files: [
      'app.js',
      'server.js',
      'test/**/*.js'
    ],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly'
      }
    },

    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-unused-vars': 'error',
      'no-undef': 'error',
      eqeqeq: 'error'
    }
  },

  {
    files: [
      'public/**/*.js'
    ],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',

      globals: {
        document: 'readonly',
        fetch: 'readonly',
        console: 'readonly'
      }
    },

    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-unused-vars': 'error',
      'no-undef': 'error',
      eqeqeq: 'error'
    }
  }
];