import { useAccessor } from 'typed-vuex'
import { Plugin } from '@nuxt/types'

import * as core from '~/store/core'

const plugin: Plugin = ({ store }, inject) => {
  inject(
    'vuex',
    useAccessor(store, {
      modules: {
        core
      }
    })
  )
}

export default plugin
