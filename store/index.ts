import { Commit } from 'vuex'
import { Post } from './blog'

export const actions = {
  async nuxtServerInit({ commit }: { commit: Commit }) {
    const mdContext = await require.context(
      '@/assets/content/posts',
      false,
      /\.md$/
    )
    const posts = [] as Post[]
    mdContext.keys().forEach((key) => {
      const md = mdContext(key)
      posts.push({ ...md.attributes } as Post)
    })
    await commit('blog/setPosts', posts)
  }
}
