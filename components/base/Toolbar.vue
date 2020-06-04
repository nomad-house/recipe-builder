<script lang="ts">
// import Vue from 'vue'
// import { Positioning, ScrollInfo } from '../mixins/Positioning'
// export default Vue.extend({
//   mixins: [Positioning],
//   props: {
//     scrollInfo: {
//       type: Object as () => ScrollInfo,
//       required: true
//     },
//     height: {
//       type: Number,
//       required: false,
//       default: 72
//     }
//   },
//   computed: {
//     fixed: function() {
//       return !this.scrollInfo.position
//     },
//     appBarColor: function(): 'default' | 'transparent' {
//       return this.scrollInfo.position > 5 ? 'default' : 'transparent'
//     },
//     drawerOpen: function() {
//       return this.$vuex.core.drawerOpen
//     },
//     links: function() {
//       return this.$vuex.core.links
//     }
//   },
//   watch: {
//     scrollInfo() {
//       if (this.$refs.positioning) {
//         const { bottom } = (this.$refs
//           .positioning as Element).getBoundingClientRect()
//         console.log(bottom - this.height)
//       }
//     }
//   },
//   async created() {
//     await this.$vuex.core.initialize()
//   },
//   beforeDestroy() {
//     this.$off('scroll')
//   },
//   methods: {
//     toggleDrawer(state?: boolean) {
//       return this.$vuex.core.toggleDrawer(state)
//     },
//     onClick(e: MouseEvent, link: any) {
//       e.stopPropagation()
//       if (link.to || !link.href) return
//       this.$vuetify.goTo(link.href)
//     }
//   }
// })
//
import { Watch, Prop, Component, Mixins } from 'vue-property-decorator'
import { Positioning, ScrollInfo } from '../mixins/Positioning'

@Component({})
export default class Toolbar extends Mixins(Positioning) {
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

  private offsetHeight = `calc(${this.heroHeight} - ${this.height})`
  private fixed = false

  private get color(): 'default' | 'transparent' {
    return this.scrollInfo.position > 5 ? 'default' : 'transparent'
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

  async created() {
    await this.$vuex.core.initialize()
  }

  beforeDestroy() {
    this.$off('scroll')
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
      <!-- :class="fixed ? 'container-fixed' : 'container'" -->
      <v-app-bar
        :fixed="fixed"
        :flat="!fixed"
        :hide-on-scroll="fixed"
        :color="color"
        :height="height"
        :style="{ marginRight: 'auto', marginLeft: 'auto' }"
        width="100rem"
        :class="fixed ? 'toolbar-fixed' : 'toolbar'"
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

.toolbar {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}
</style>
