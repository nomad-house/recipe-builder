<template>
  <div class="container">
    <blog-header
      v-if="haveAttributes"
      :title="attributes.title"
      :sub-title="attributes.subTitle"
      :published="attributes.published"
      :author-avatar="attributes.hero"
      :author-name="attributes.authorName"
      :author-blurb="attributes.authorBlurb"
      :tags="attributes.tags"
    />
    <div :if="markdownBody">
      <component :is="markdownBody"></component>
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
import BlogHeader from '@/components/blog/BlogHeader.vue'

export default defineComponent({
  components: { BlogHeader },
  setup() {
    const markdownBody = ref(undefined)
    const attributes = ref({})
    const haveAttributes = computed(
      () => !!Object.keys(attributes.value).length
    )
    const route = useRoute()
    const slug = computed(() => route.value.params.slug)
    watchEffect(() => {
      import(`@/assets/content/posts/${slug.value}.md`).then((fm) => {
        markdownBody.value = fm.vue.component
        attributes.value = fm.attributes
      })
    })
    return {
      slug,
      haveAttributes,
      markdownBody,
      attributes,
    }
  },
})
</script>
