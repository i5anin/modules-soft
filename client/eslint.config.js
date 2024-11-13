import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginUnusedImports from 'eslint-plugin-unused-imports'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  {
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
    plugins: {
      'unused-imports': pluginUnusedImports, // Указываем плагин в формате объекта
    },
    rules: {
      'id-match': [
        'warn',
        '^(table(Data|Fields|Headers|Rows|Columns|Records|Status|Config|Info|Details|props))$',
        {
          properties: true,
          ignoreDestructuring: true, // Игнорирует деструктурированные параметры, такие как 'props'
          onlyDeclarations: true, // Проверяет только объявления переменных, игнорируя ключевые слова
        },
      ],
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: 'vue',
              importNames: [
                'props',
                'ref',
                'reactive',
                'computed',
                'watch',
                'watchEffect',
                'onMounted',
                'onUpdated',
                'onUnmounted',
                'onBeforeMount',
                'onBeforeUpdate',
                'onBeforeUnmount',
                'provide',
                'inject',
                'nextTick',
                'defineComponent',
                'toRef',
                'toRefs',
                'isRef',
                'isReactive',
                'isReadonly',
                'readonly',
                'shallowRef',
                'shallowReactive',
                'markRaw',
                'customRef',
                'unref',
              ],
              message:
                'Импортируйте стандартные функции Vue 3 для использования в Composition API',
            },
          ],
        },
      ],
      'vue/multi-word-component-names': 'off',
      'max-lines': ['warn', { max: 350 }],
      complexity: ['warn', { max: 10 }],
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
    },
  },
]
