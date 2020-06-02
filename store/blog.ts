import { mutationTree, actionTree, getterTree } from 'nuxt-typed-vuex'

export const namespaced = true

interface Post {}

export const state = () => ({
  posts: [] as Post[],
  categories: [] as string[]
})

export type BlogState = ReturnType<typeof state>

export const getters = getterTree(state, {})

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
