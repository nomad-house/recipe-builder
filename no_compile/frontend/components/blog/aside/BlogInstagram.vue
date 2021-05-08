<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
interface InstagramPost {
  src: string
  href?: string
}

@Component({})
export default class BlogInstagram extends Vue {
  private posts: InstagramPost[] = [
    { src: 'adventurealtitude.jpg' },
    { src: 'garden.jpg' },
    { src: 'pigduck.jpg' },
    { src: 'rain.jpg' },
    { src: 'spices.jpg' },
    { src: 'sunset.jpg' }
  ]
}
</script>

<template>
  <v-container class="pa-0">
    <base-subheading>On Instagram</base-subheading>
    <v-row>
      <v-col v-for="(post, i) in posts" :key="i" cols="4">
        <base-card :href="post.href" color="grey lighten-2" height="88" tag="a">
          <v-img
            v-if="post.src"
            :src="require(`@/assets/instagram/${post.src}`)"
            height="100%"
          />
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>
