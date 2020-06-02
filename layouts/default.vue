<script>
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class DefaultLayout extends Vue {}
</script>

<template>
  <v-app>
    <base-toolbar />
    <base-drawer />
    <v-content>
      <nuxt />
    </v-content>
    <base-footer />
  </v-app>
</template>
