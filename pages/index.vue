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
    <v-container pt-0 pb-0 pl-4 pr-4>
      <blog-feed :bind="$attrs" />
      <blog-aside />
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.feed-container {
  background-color: white;
}
</style>
