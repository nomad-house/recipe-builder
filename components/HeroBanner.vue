<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ScrollInfo } from '@/components/mixins/Positioning'
@Component({})
export default class HeroBanner extends Vue {
  @Prop() scrollInfo!: ScrollInfo
  private get heroVisible() {
    return this.scrollInfo.position < 20
  }
}
</script>

<template>
  <v-row
    v-show="heroVisible"
    class="fill-height pa-3 hero-content"
    align="center"
  >
    <v-col cols="12" md="7" offset-md="5">
      <h1 class="display-3 font-weight-light">
        The Art Of Travel
      </h1>

      <div class="subheading text-uppercase pl-2 mb-4">
        Finding Beauty, One flight at a time
      </div>

      <v-btn color="primary" depressed>
        Subscribe
      </v-btn>
    </v-col>
  </v-row>
</template>
