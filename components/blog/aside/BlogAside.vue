<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    BlogAbout: () => import('@/components/blog/aside/BlogAbout.vue'),
    BlogSubscribe: () => import('@/components/blog/aside/BlogSubscribe.vue'),
    BlogSocial: () => import('@/components/blog/aside/BlogSocial.vue')
  }
})
export default class BlogAside extends Vue {}
</script>

<template>
  <aside>
    <blog-about />
    <blog-subscribe />
    <blog-social />
  </aside>
</template>
