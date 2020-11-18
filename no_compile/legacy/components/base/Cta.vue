<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class Cta extends Vue {
  get styles() {
    return {
      marginTop: `${this.$vuetify.application.top}px`
    }
  }
}
</script>

<template>
  <v-btn
    :style="styles"
    color="secondary"
    fab
    fixed
    href="https://store.vuetifyjs.com/product/blog-theme-free"
    rel="noopener"
    right
    target="_blank"
    top
  >
    <v-icon>
      mdi-vuetify
    </v-icon>
  </v-btn>
</template>
