import { mutationTree, actionTree, getterTree } from 'nuxt-typed-vuex'

export interface Link {
  text: string
  href: string
  to: string
}

export const namespaced = true

export const state = () => ({
  drawerOpen: false,
  links: [
    { text: 'one', href: '', to: '' },
    { text: 'two', href: '', to: '' },
    { text: 'three', href: '', to: '' }
  ] as Link[]
})

export type CoreState = ReturnType<typeof state>

export const getters = getterTree(state, {
  drawerOpen(state) {
    return state.drawerOpen
  },
  links(state) {
    return state.links
  }
})

export const mutations = mutationTree(state, {
  toggleDrawer(state, open?: boolean) {
    state.drawerOpen = typeof open === 'boolean' ? open : !state.drawerOpen
  }
})

export const actions = actionTree({ state, getters, mutations }, {})
