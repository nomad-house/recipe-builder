import {
  mutationTree,
  actionTree,
  getterTree,
  useAccessor
} from 'nuxt-typed-vuex'
import * as blogModule from './blog'

export interface Link {
  text: string
  href: string
  to: string
}

export const namespaced = true

export const state = () => ({
  drawerOpen: false,
  links: [] as Link[]
})

export type CoreState = ReturnType<typeof state>

export const getters = getterTree(state, {
  drawerOpen(state) {
    return state.drawerOpen
  }
})

export const mutations = mutationTree(state, {
  toggleDrawer(state, open?: boolean) {
    state.drawerOpen = typeof open === 'boolean' ? open : !state.drawerOpen
  },
  setLinks(state, links: Link[]) {
    state.links = links
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    initialize({ commit }) {
      const blog = useAccessor(
        this.app.store!,
        { ...blogModule, namespaced: true },
        'blog'
      )
      commit(
        'setLinks',
        blog.categories.slice(0, 4).map((category) => ({
          text: category,
          href: `/${category.toLowerCase()}`,
          to: `/${category.toLowerCase()}`
        }))
      )
    }
  }
)
