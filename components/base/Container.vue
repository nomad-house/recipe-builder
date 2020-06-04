<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class Container extends Vue {}
</script>

<template>
  <div class="container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  max-width: 100rem;
}
</style>
