<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Post } from '@/store/blog'

@Component({})
export default class BlogFeedCard extends Vue {
  @Prop({ required: true }) size!: number
  @Prop({ default: () => ({}) }) value!: Post
}
</script>

<template>
  <v-col cols="12" :md="size === 2 ? 6 : size === 3 ? 4 : undefined">
    <!-- :height="value.prominent ? 450 : 350" -->
    <v-card height="400" color="grey lighten-1" dark href="#!">
      <v-img
        :src="require(`@/static/media/${value.hero}`)"
        height="100%"
        gradient="rgba(0, 0, 0, .42), rgba(0, 0, 0, .42)"
      >
        <v-row v-if="!value.prominent" class="fill-height text-right ma-0">
          <v-col cols="12">
            <v-chip
              label
              class="mx-0 mb-2 text-uppercase"
              color="grey darken-3"
              text-color="white"
              small
              @click.stop=""
            >
              {{ value.category.join(', ') }}
            </v-chip>
            <h3 class="title font-weight-bold mb-2">
              {{ value.title }}
            </h3>
            <div class="caption">{{ value.author }}<br />Date</div>
          </v-col>
          <v-col align-self="end">
            <v-chip
              class="text-uppercase ma-0"
              color="primary"
              label
              small
              @click.stop=""
            >
              Read More
            </v-chip>
          </v-col>
        </v-row>
      </v-img>
    </v-card>
  </v-col>
</template>

<style>
.v-image__image {
  transition: 0.3s linear;
}
</style>
