import { mutationTree, actionTree, getterTree } from 'nuxt-typed-vuex'

export const namespaced = true

export interface Post {
  title: string
  author: string
  category: string
  hero: string
}

export const state = () => ({
  posts: [] as Post[]
})

export type BlogState = ReturnType<typeof state>

export const getters = getterTree(state, {
  categories(state) {
    const categories = new Set<string>()
    for (const { category } of state.posts) {
      if (!categories.has(category)) categories.add(category)
    }
    return [...categories].sort()
  }
})

export const mutations = mutationTree(state, {
  setPosts(state, posts: Post[]) {
    state.posts = posts
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    getPosts({ commit }) {
      commit('setPosts', require('@/assets/articles.json'))
    }
  }
)
