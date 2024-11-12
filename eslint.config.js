import pluginJs from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import pluginTs from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,astro}'] },
  { ignores: ['.astro/**/*', 'dist/**/*', '**/static/'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true },
      ],
    },
  },
  // @see https://github.com/lydell/eslint-plugin-simple-import-sort
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  // @see https://github.com/sweepline/eslint-plugin-unused-imports
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
