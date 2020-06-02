<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class BlogBanner extends Vue {
  get categories() {
    return this.$vuex.blog.categories
  }
}
</script>

<template>
  <v-container class="pa-0">
    <base-subheading>Tags</base-subheading>
    <v-chip
      v-for="(category, i) in categories"
      :key="i"
      class="mr-2"
      color="secondary"
      label
      small
      tag
      text-color="white"
    >
      {{ category.text }}
    </v-chip>
  </v-container>
</template>
