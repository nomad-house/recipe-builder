<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    BlogFeed: () => import('@/components/blog/feed/BlogFeed.vue'),
    BlogAside: () => import('@/components/blog/aside/BlogAside.vue')
  }
})
export default class BlogPage extends Vue {}
</script>

<template>
  <div>
    <blog-feed id="feed" />
    <blog-aside />
  </div>
</template>
