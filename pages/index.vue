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
  <div class="feed-container">
    <blog-feed />
    <blog-aside />
  </div>
</template>

<style lang="scss" scoped>
.feed-container {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  background-color: white;
}
</style>
