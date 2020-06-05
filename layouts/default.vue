<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { ScrollInfo, Positioning } from '@/components/mixins/Positioning'
@Component({
  components: {
    HeroBanner: () => import('@/components/HeroBanner.vue')
  }
})
export default class DefaultLayout extends Mixins(Positioning) {
  private scrollInfo: ScrollInfo = { position: 0, direction: 'down' }
  private height = '72px'
  private heroHeight = '100vh'
  private resetHeight = 0
  created() {
    this.$on('scroll', (scrollInfo: ScrollInfo) => {
      this.scrollInfo = scrollInfo
    })
  }

  mouted() {
    this.resetHeight = (this.$refs.hero as Element).clientHeight
  }

  beforeDestroy() {
    this.$off('scroll')
  }
}
</script>

<template>
  <v-app :style="{ position: 'relative' }">
    <base-drawer />
    <div
      ref="hero"
      class="hero-container"
      :style="{
        backgroundImage: 'url(' + require('@/static/media/blurcamera.jpg') + ')'
      }"
    >
      <hero-banner :scroll-info="scrollInfo" />
    </div>
    <base-toolbar
      :scroll-info="scrollInfo"
      :height="height"
      :hero-height="heroHeight"
      :style="{ zIndex: 20 }"
      class="relative"
    />
    <base-container class="relative" :style="{ zIndex: 10 }">
      <nuxt :reset-height="resetHeight" />
    </base-container>
    <base-footer />
  </v-app>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.hero-container {
  position: fixed;
  z-index: 0;
  width: 100%;
  height: 100vh;
  color: white;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
.relative {
  position: relative;
}
</style>
