<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import { State } from '~/store/State'

export default Vue.extend({
  computed: {
    ...mapState<State>({
      drawerOpen: (state: State) => state.core.drawerOpen,
      links: (state: State) => state.core.links
    })
  },
  methods: {
    ...mapMutations({
      toggleDrawer: 'core/toggleDrawer'
    }),
    onClick(e: MouseEvent, link: any) {
      e.stopPropagation()
      if (link.to || !link.href) return
      this.$vuetify.goTo(link.href)
    }
  }
})
</script>

<template>
  <v-app-bar app flat>
    <v-app-bar-nav-icon class="hidden-md-and-up" @click="toggleDrawer" />
    <v-container mx-auto py-0>
      <v-layout>
        <v-img
          :src="require('@/assets/demo/img/logo.png')"
          class="mr-5"
          contain
          height="48"
          width="48"
          max-width="48"
          @click="$vuetify.goTo(0)"
        />
        <v-btn
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          class="ml-0 hidden-sm-and-down"
          text
          @click="onClick($event, link)"
        >
          {{ link.text }}
        </v-btn>
        <v-spacer />
        <v-text-field
          append-icon="mdi-magnify"
          text
          hide-details
          solo-inverted
          style="max-width: 300px;"
        />
      </v-layout>
    </v-container>
  </v-app-bar>
</template>
