<script setup lang="ts">
  import { ref } from 'vue';

  // Define emits
  const emit = defineEmits<(e: 'change', event: Event) => void>();

  // Handle change event
  const onChange = (e: Event) => {
    emit('change', e);
  };
</script>

<template>
  <input class="we-input-date" type="date" @change="onChange" />
</template>

<style lang="scss" scoped>
  .we-input-date {
    background-color: var(--color-background);
    border: var(--size-1) solid var(--color-border);
    border-radius: var(--size-4);
    font-family: inherit;
    font-size: var(--size-14);
    min-height: 2rem;
    padding: 0rem var(--size-4);

    &:hover,
    &:focus-visible {
      outline: none;
      border-color: var(--color-primary);
    }
  }
</style>