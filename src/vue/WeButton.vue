<script setup>
  import { ref } from 'vue';
</script>

<template>
  <button class="we-button">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
  .we-button {
    align-items: center;
    background-color: #ffffff;
    border: calc(1rem / 16) solid var(--color-border);
    border-radius: calc(1rem / 4);
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    min-height: 2rem;
    min-width: 2rem;
    padding: 0;

    &:hover {
      border-color: var(--color-primary);
    }
  }
</style>