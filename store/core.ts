interface Link {
  text: string
  href: string
  to: string
}

export interface CoreState {
  drawerOpen: boolean
  links: Link[]
}

export const state = (): CoreState => ({
  drawerOpen: false,
  links: [
    { text: 'one', href: '', to: '' },
    { text: 'two', href: '', to: '' },
    { text: 'three', href: '', to: '' }
  ]
})

export const mutations = {
  toggleDrawer(state: CoreState, open?: boolean) {
    state.drawerOpen = typeof open === 'boolean' ? open : !state.drawerOpen
  }
}

export type CoreMutations = typeof mutations

export const actions = {}
