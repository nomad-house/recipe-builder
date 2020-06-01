<script>
import Vue from 'vue'
export default Vue.extend()
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
