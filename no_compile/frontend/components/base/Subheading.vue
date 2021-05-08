<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class Subheading extends Vue {}
</script>

<template>
  <h2
    class="subheading text-uppercase font-weight-medium mb-3"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </h2>
</template>
