<script>
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class DefaultLayout extends Vue {}
</script>

<template>
  <v-app>
    <core-toolbar />
    <core-drawer />
    <v-content>
      <nuxt />
    </v-content>
    <core-footer />
  </v-app>
</template>
