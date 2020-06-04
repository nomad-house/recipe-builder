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
  <v-app>
    <base-toolbar :scroll-info="scrollInfo" />
    <base-drawer />
    <hero-banner class="hero" :scroll-info="scrollInfo" />
    <base-container class="offset">
      <nuxt />
    </base-container>
    <base-footer />
  </v-app>
</template>

<style lang="scss" scoped>
.offset {
  margin-top: 35rem;
}
.hero {
  position: fixed;
  width: 100%;
  height: 40rem;
}
</style>
