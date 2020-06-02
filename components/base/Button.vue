<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({})
export default class Button extends Vue {
  @Prop() square!: Boolean
  get styles() {
    return {
      borderRadius: this.square ? '2px' : undefined
    }
  }
}
</script>

<template>
  <v-btn
    :style="styles"
    color="primary"
    fab
    small
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </v-btn>
</template>
