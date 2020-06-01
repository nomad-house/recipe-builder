module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended', // goes with plugin
    'plugin:nuxt/recommended', // goes with plugin
    'plugin:vue/base',
    'plugin:vue/recommended', // from eslint-plugin-vue
    'prettier', // from eslint-config-prettier
    'prettier/standard', // from eslint-config-prettier
    'prettier/vue' // from eslint-config-prettier
  ],
  plugins: ['prettier', 'nuxt', 'vue'],
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'import/no-mutable-exports': 0
  }
}
