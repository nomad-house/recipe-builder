<template>
  <Constitution />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Constitution from "../components/Constitution.vue";

export default defineComponent({
  name: "Home",
  components: {
    Constitution,
  },
});
</script>

<style lang="scss" scoped>
.fancy-class {
  color: black;
}
</style>
