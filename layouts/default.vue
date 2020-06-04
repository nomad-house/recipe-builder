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
  created() {
    this.$on('scroll', (scrollInfo: ScrollInfo) => {
      this.scrollInfo = scrollInfo
    })
  }

  beforeDestroy() {
    this.$off('scroll')
  }
}
</script>

<template>
  <v-app :style="{ position: 'relative' }">
    <base-drawer />
    <hero-banner class="hero" :scroll-info="scrollInfo" />
    <base-toolbar
      :scroll-info="scrollInfo"
      :height="height"
      :hero-height="heroHeight"
    />
    <base-container>
      <nuxt />
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
.hero {
  position: fixed;
  width: 100%;
  height: 40rem;
}
</style>
