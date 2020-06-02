import { getAccessorType } from 'nuxt-typed-vuex'
import { useAccessor } from 'typed-vuex'
import { Plugin } from '@nuxt/types'

import * as core from '@/store/core'
import * as blog from '@/store/blog'

const modules = {
  core,
  blog
}

const plugin: Plugin = ({ store }, inject) => {
  inject(
    'vuex',
    useAccessor(store, {
      modules
    })
  )
}

export default plugin

const accessorType = getAccessorType({
  modules
})

// eslint-disable-next-line
declare module 'vue/types/vue' {
  interface Vue {
    $vuex: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $vuex: typeof accessorType
  }
  interface Context {
    $vuex: typeof accessorType
  }
}
