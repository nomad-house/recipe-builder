import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'
import '@mdi/font/css/materialdesignicons.css'
import { Context } from '@nuxt/types'

Vue.use(Vuetify)

export default (ctx: Context) => {
  const vuetify = new Vuetify({
    icons: {
      iconfont: 'mdi' // default - only for display purposes
    },
    theme: {
      options: {
        minifyTheme: (css) => {
          return process.env.NODE_ENV === 'production'
            ? css.replace(/[\r\n|\r|\n]/g, '')
            : css
        }
      },
      themes: {
        light: {
          primary: '#CBAA5C',
          secondary: '#083759',
          error: colors.red.accent3
        },
        dark: {
          primary: colors.blue.lighten3
        }
      }
    }
  })

  ctx.app.vuetify = vuetify
  // @ts-ignore
  ctx.$vuetify = vuetify.framework
}

declare module 'vue/types/vue' {}
