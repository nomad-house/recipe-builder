import { resolve } from 'path'
import colors from 'vuetify/es5/util/colors'
import FMMode from 'frontmatter-markdown-loader/mode'
// import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'

export default {
  telemetry: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - codeified',
    title: 'codeified',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
    },
    extend(config) {
      config?.module?.rules?.push({
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
        include: resolve(__dirname, 'assets'),
        options: {
          mode: [FMMode.VUE_COMPONENT],
          vue: {
            root: 'markdown-body',
          },
        },
      })
    },
    // plugins: [
    //   new VuetifyLoaderPlugin({
    //     /**
    //      * This function will be called for every tag used in each vue component
    //      * It should return an array, the first element will be inserted into the
    //      * components array, the second should be a corresponding import
    //      *
    //      * originalTag - the tag as it was originally used in the template
    //      * kebabTag    - the tag normalised to kebab-case
    //      * camelTag    - the tag normalised to PascalCase
    //      * path        - a relative path to the current .vue file
    //      * component   - a parsed representation of the current component
    //      */
    //     match(_, { kebabTag, camelTag }) {
    //       if (kebabTag.startsWith('base-')) {
    //         return [
    //           camelTag,
    //           `import ${camelTag} from '@/components/base/${camelTag.substring(
    //             4
    //           )}.vue'`,
    //         ]
    //       }
    //     },
    //   }),
    // ],
  },
}
