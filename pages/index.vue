<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    BlogAbout: () => import('@/components/blog/BlogAbout.vue'),
    BlogArticles: () => import('@/components/blog/BlogArticles.vue'),
    BlogBanner: () => import('@/components/blog/BlogBanner.vue'),
    BlogSocial: () => import('@/components/blog/BlogSocial.vue'),
    BlogSubscribe: () => import('@/components/blog/BlogSubscribe.vue')
  }
})
export default class BlogPage extends Vue {}
</script>

<template>
  <div>
    <blog-articles>
      <blog-banner />
    </blog-articles>
    <blog-about />
    <blog-subscribe />
    <blog-social />
  </div>
</template>
