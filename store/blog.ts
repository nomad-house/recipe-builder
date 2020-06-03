import Vue from 'vue'
import { mutationTree, getterTree } from 'nuxt-typed-vuex'

export const namespaced = true

export interface Post {
  title: string
  subtitle: string
  author: string
  prominent?: boolean
  category: string[]
  hero: string
  published: Date
  updated?: Date
  body: InstanceType<typeof Vue>
}

export const state = () => ({
  posts: [] as Post[]
})

export type BlogState = ReturnType<typeof state>

export const getters = getterTree(state, {
  categories(state) {
    const categories = new Set<string>()
    for (const { category } of state.posts) {
      if (!categories.has(category[0])) categories.add(category[0])
    }
    return [...categories].sort()
  }
})

export const mutations = mutationTree(state, {
  setPosts(state, posts: Post[]) {
    state.posts = posts
  }
})

// export const actions = actionTree(
//   { state, getters, mutations },
//   {
//     getPosts({ commit }) {
//       commit('setPosts', require('@/assets/articles.json'))
//     }
//   }
// )
