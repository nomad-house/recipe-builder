<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class Container extends Vue {}
</script>

<template>
  <div :bind="$attrs">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
div {
  width: 100%;
  max-width: 100rem;
  margin-right: auto;
  margin-left: auto;
}
</style>
