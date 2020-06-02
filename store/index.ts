import { getAccessorType } from 'nuxt-typed-vuex'
import * as core from './core'

export const accessorType = getAccessorType({
  modules: {
    core
  }
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
