<script setup>
  import { ref } from 'vue';

  // Define emits
  const emit = defineEmits(['change']);

  // Handle change event
  const onChange = e => {
    emit('change', e);
  }
</script>

<template>
  <input class="app-input-date" type="date" @change="onChange" />
</template>

<style lang="scss" scoped>
  .app-input-date {
    border: calc(1rem / 16) solid #cccccc;
    border-radius: calc(1rem / 4);
    min-height: 2rem;
    padding: 0rem calc(1rem / 4);
  }
</style>