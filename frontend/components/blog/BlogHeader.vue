<template>
  <div class="header-container">
    <div class="header-row">
      <span v-if="tags.length" class="tags">
        <span class="tag">Tags:</span>
        <a
          v-for="(tag, index) in tags"
          :key="index"
          :nuxt-link="'blog/tags/' + tag"
        >
          <span>
            {{ tag }}
          </span>
        </a>
        <span class="dot-spacer">&nbsp;</span>
      </span>
      <span class="date">{{ published }}</span>
    </div>
    <div class="header-row">
      <h1>{{ title }}</h1>
      <h2 :v-if="subTitle">{{ subTitle }}</h2>
    </div>
    <div class="header-row">
      <span>
        <img
          class="author-avatar"
          :src="'/media/' + authorAvatar"
          alt="author avatar"
        />
      </span>
      <span>
        <span v-if="authorName" class="author-name">
          {{ authorName }}
        </span>
        <span v-if="authorBlurb" class="author-blurb">
          {{ authorBlurb }}
        </span>
      </span>
      <span>Socials</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    published: {
      type: String,
      required: true,
    },
    authorAvatar: {
      type: String,
      required: false,
      default: undefined,
    },
    authorName: {
      type: String,
      required: false,
      default: undefined,
    },
    authorBlurb: {
      type: String,
      required: false,
      default: undefined,
    },
    tags: {
      type: Array,
      required: false,
      default: [] as string[],
    },
  },
})
</script>

<style lang="scss" scoped>
.author-avatar {
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
}

.dot-spacer {
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  width: 50%;
  height: 50%;
  background-color: grey;
  border-radius: 50%;
}
</style>
