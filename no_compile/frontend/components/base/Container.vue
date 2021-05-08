<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
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
  margin-right: auto;
  margin-left: auto;
}
@media screen and (min-width: 960px) {
  div {
    max-width: 900px;
  }
}
@media screen and (min-width: 1264px) {
  div {
    max-width: 1185px;
  }
}
@media screen and (min-width: 1904px) {
  div {
    max-width: 1785px;
  }
}
</style>
