<script lang="ts">
import { Prop, Component, Mixins } from 'vue-property-decorator'
import { Positioning, ScrollInfo } from '../mixins/Positioning'

@Component({})
export default class Toolbar extends Mixins(Positioning) {
  @Prop() scrollInfo!: ScrollInfo

  async created() {
    await this.$vuex.core.initialize()
  }

  beforeDestroy() {
    this.$off('scroll')
  }

  private get appBarColor(): 'default' | 'transparent' {
    return this.scrollInfo.position > 5 ? 'default' : 'transparent'
  }

  private get drawerOpen() {
    return this.$vuex.core.drawerOpen
  }

  private get links() {
    return this.$vuex.core.links
  }

  toggleDrawer(state?: boolean) {
    return this.$vuex.core.toggleDrawer(state)
  }

  onClick(e: MouseEvent, link: any) {
    e.stopPropagation()
    if (link.to || !link.href) return
    this.$vuetify.goTo(link.href)
  }
}
</script>

<template>
  <v-app-bar app elevate-on-scroll :color="appBarColor">
    <base-container>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="toggleDrawer" />
      <v-container mx-auto py-0>
        <v-row align="center">
          <v-img
            :src="require('@/assets/logo.png')"
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
            :color="appBarColor === 'transparent' ? 'white' : 'black'"
            text
            @click="onClick($event, link)"
          >
            {{ link.text }}
          </v-btn>
          <v-spacer />
          <v-text-field
            :color="appBarColor === 'transparent' ? 'white' : 'black'"
            append-icon="mdi-magnify"
            text
            hide-details
            style="max-width: 300px;"
          />
        </v-row>
      </v-container>
    </base-container>
  </v-app-bar>
</template>

<style lang="scss" scoped>
.toolbar {
  background-color: transparent;
}
</style>
