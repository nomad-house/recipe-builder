<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    BlogNewest: () => import('@/components/blog/aside/BlogNewest.vue'),
    BlogInstagram: () => import('@/components/blog/aside/BlogInstagram.vue'),
    BlogCategories: () => import('@/components/blog/aside/BlogCategories.vue')
  }
})
export default class BlogSocial extends Vue {}
</script>

<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-container>
        <blog-instagram />
      </v-container>
    </v-col>
    <v-col cols="12" md="4">
      <v-container>
        <blog-newest />
      </v-container>
    </v-col>
    <v-col cols="12" md="4">
      <v-container>
        <blog-categories />
      </v-container>
    </v-col>
  </v-row>
</template>
