<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class Card extends Vue {}
</script>

<template>
  <v-card flat tile v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-card>
</template>
