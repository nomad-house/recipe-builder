<template>
  <div class="container">
    <div class="tags">
      Tags:
      <span :v-for="(tag, index) in tags" :key="index">
        <a :nuxt-link="'blog/tags/' + tag">{{ tag }}</a>
      </span>
    </div>
    <div :if="component">
      {{ attributes }}
      <component :is="component"></component>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useRoute,
  computed,
  ref,
  watchEffect,
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const component = ref(undefined)
    const attributes = ref(undefined)
    const route = useRoute()
    const slug = computed(() => route.value.params.slug)
    watchEffect(() => {
      import(`@/assets/content/posts/${slug.value}.md`).then((fm) => {
        component.value = fm.vue.component
        attributes.value = fm.attributes
      })
    })
    return {
      slug,
      component,
      attributes,
    }
  },
})
</script>
