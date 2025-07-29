import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...prettierRecommended,
    files: ['**/*.ts'],
    plugins: {
      prettier: prettierPlugin
    },
  }
]
