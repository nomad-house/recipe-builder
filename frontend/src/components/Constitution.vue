<template>
  <p @contextmenu.prevent="onContextMenu($event)">{{ preamble }}</p>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Constitution",
  setup() {
    const preamble = ref(
      "We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America."
    );

    function onContextMenu(event: MouseEvent) {
      const selection = document.getSelection();
      if (selection) {
        console.log({ event, selection });
        // preamble.value = preamble.value.replace(selection, "");
      }
    }

    return {
      preamble,
      onContextMenu
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
