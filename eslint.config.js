import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginUnusedImports from 'eslint-plugin-unused-imports'
import pluginPrettier from 'eslint-plugin-prettier'
import vueParser from 'vue-eslint-parser'

export default [
  // Общие правила для JS/TS/Vue
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
      },
      globals: globals.browser,
    },
    plugins: {
      'unused-imports': pluginUnusedImports,
      prettier: pluginPrettier,
    },
    rules: {
      'no-debugger': 'error',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'group', 'groupCollapsed', 'groupEnd'],
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          semi: false,
          trailingComma: 'es5',
          endOfLine: 'lf',
          htmlWhitespaceSensitivity: 'strict',
          vueIndentScriptAndStyle: true,
          bracketSameLine: false,
          singleAttributePerLine: false,
        },
      ],
    },
  },

  // Специально для .vue-файлов — чтобы работал <template>
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser, // для <script setup>
        ecmaVersion: 2023,
        sourceType: 'module',
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      ...pluginVue.configs['flat/recommended'].rules,
      'vue/attribute-hyphenation': ['warn', 'always'],
      'vue/v-on-event-hyphenation': ['warn', 'always'],
      'vue/attributes-order': 'warn',
      'vue/html-indent': [
        'warn',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          alignAttributesVertically: true,
        },
      ],
      'vue/max-len': [
        'warn',
        {
          code: 80,
          template: 80,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
        },
      ],
      'vue/multi-word-component-names': 'off',
    },
  },
]
