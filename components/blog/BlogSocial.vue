<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    BlogNewest: () => import('@/components/blog/BlogNewest.vue'),
    BlogInstagram: () => import('@/components/blog/BlogInstagram.vue'),
    BlogTags: () => import('@/components/blog/BlogTags.vue')
  }
})
export default class BlogSocial extends Vue {}
</script>

<template>
  <v-container id="social" tag="section">
    <v-row>
      <v-col cols="12" md="4">
        <blog-instagram />
      </v-col>
      <v-col cols="12" md="4">
        <blog-newest />
      </v-col>
      <v-col cols="12" md="4">
        <blog-tags />
      </v-col>
    </v-row>
  </v-container>
</template>
