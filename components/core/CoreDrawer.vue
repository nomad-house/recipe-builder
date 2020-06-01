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
      if (link.to === '/') {
        this.$vuetify.goTo(0)
        this.toggleDrawer(false)
        return
      }
      if (link.to || !link.href) return
      this.$vuetify.goTo(link.href)
      this.toggleDrawer(false)
    }
  }
})
</script>

<template>
  <v-navigation-drawer v-model="drawerOpen" app dark temporary>
    <v-list>
      <v-list-item
        v-for="(link, i) in links"
        :key="i"
        :to="link.to"
        :href="link.href"
        @click="onClick($event, link)"
      >
        <v-list-item-title v-text="link.text" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
