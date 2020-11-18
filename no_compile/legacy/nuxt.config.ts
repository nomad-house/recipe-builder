import { resolve } from 'path'
import { Configuration } from '@nuxt/types'
const FMMode = require('frontmatter-markdown-loader/mode')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    './plugins/vuetify-accessor.ts',
    './plugins/axios-accessor.ts',
    './plugins/store-accessor.ts'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    'nuxt-typed-vuex',
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /**
   *
   */
  router: {},
  /*
   ** Build configuration
   */
  build: {
    extend(config, context) {
      if (context.isDev && !process.client) {
        config!.module!.rules.push({
          enforce: 'pre',
          test: /\.(ts|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config!.module!.rules.push({
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
        include: resolve(__dirname, 'assets'),
        options: {
          mode: [FMMode.VUE_COMPONENT],
          vue: {
            root: 'markdown-body'
          }
        }
      })
    },
    loaders: {
      sass: {
        implementation: require('sass'),
        sassOptions: {
          fiber: require('fibers'),
          indentedSyntax: true
        }
      }
    },
    plugins: [
      new VuetifyLoaderPlugin({
        /**
         * This function will be called for every tag used in each vue component
         * It should return an array, the first element will be inserted into the
         * components array, the second should be a corresponding import
         *
         * originalTag - the tag as it was originally used in the template
         * kebabTag    - the tag normalised to kebab-case
         * camelTag    - the tag normalised to PascalCase
         * path        - a relative path to the current .vue file
         * component   - a parsed representation of the current component
         */
        match(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _: string,
          { kebabTag, camelTag }: { kebabTag: string; camelTag: string }
        ) {
          if (kebabTag.startsWith('base-')) {
            return [
              camelTag,
              `import ${camelTag} from '@/components/base/${camelTag.substring(
                4
              )}.vue'`
            ]
          }
        }
      })
    ],
    transpile: ['vuetify/lib', /typed-vuex/],
    typescript: {
      // this is required - if set to true the HMR in dev will time out
      typeCheck: false
    }
  },
  typescript: {
    typeCheck: {
      eslint: true
    }
  }
} as Configuration
