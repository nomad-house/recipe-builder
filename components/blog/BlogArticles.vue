<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    BlogFeed: () => import('@/components/blog/BlogFeed.vue')
  }
})
export default class BlogArticles extends Vue {}
</script>

<template>
  <section id="feed">
    <blog-feed>
      <slot />
    </blog-feed>
  </section>
</template>
