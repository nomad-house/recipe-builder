<script lang="ts">
import { Watch, Prop, Component, Mixins } from 'vue-property-decorator'
import { Positioning, ScrollInfo } from '../mixins/Positioning'
import { Resize } from '../mixins/Resize'

@Component({})
export default class Toolbar extends Mixins(Positioning, Resize) {
  @Prop({ default: '72px' }) height!: string
  @Prop({ default: '100vh' }) heroHeight!: string
  @Prop() scrollInfo!: ScrollInfo
  @Watch('scrollInfo')
  onScrollInfo() {
    if (this.$refs.positioning) {
      const { bottom } = (this.$refs
        .positioning as Element).getBoundingClientRect()
      this.fixed = bottom <= 0
    }
  }

  private maxWidth: string = '100%'
  private offsetHeight = `calc(${this.heroHeight} - ${this.height})`
  private fixed = false

  private get color(): 'default' | 'transparent' | string {
    return this.scrollInfo.position > 5 ? 'white' : 'transparent'
  }

  private get drawerOpen() {
    return this.$vuex.core.drawerOpen
  }

  private get links() {
    return this.$vuex.core.links
  }

  private toggleDrawer(state?: boolean) {
    return this.$vuex.core.toggleDrawer(state)
  }

  private onClick(e: MouseEvent, link: any) {
    e.stopPropagation()
    if (link.to || !link.href) return
    this.$vuetify.goTo(link.href)
  }

  private onResize() {
    const width = this.$isServer ? 0 : window.innerWidth
    this.maxWidth =
      width > 1904
        ? '1785px'
        : width > 1264
        ? '1185px'
        : width > 960
        ? '900px'
        : '100%'
    this.$forceUpdate()
  }

  async created() {
    await this.$vuex.core.initialize()
    this.$on('resize', this.onResize)
  }

  beforeMount() {
    this.onResize()
  }

  beforeDestroy() {
    this.$off('resize')
  }
}
</script>

<template>
  <base-container>
    <div
      ref="positioning"
      :style="{ height: offsetHeight, minHeight: offsetHeight }"
      class="positioning"
    />
    <div class="toolbar-container" :style="{ minHeight: height }">
      <v-app-bar
        :fixed="fixed"
        :flat="!fixed"
        :color="color"
        :height="height"
        :width="maxWidth"
        :style="{
          marginRight: 'auto',
          marginLeft: 'auto',
          transition: 'width .2s'
        }"
      >
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
              :color="color === 'transparent' ? 'white' : 'black'"
              class="ml-0 hidden-sm-and-down"
              text
              @click="onClick($event, link)"
            >
              {{ link.text }}
            </v-btn>
            <v-spacer />
            <v-text-field
              :color="color === 'transparent' ? 'white' : 'black'"
              :dark="color === 'transparent'"
              append-icon="mdi-magnify"
              text
              hide-details
              style="max-width: 300px;"
            />
          </v-row>
        </v-container>
      </v-app-bar>
    </div>
  </base-container>
</template>

<style lang="scss" scoped>
.positioning {
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}

.toolbar-container {
  width: 100%;
  padding: 0;
}
</style>
