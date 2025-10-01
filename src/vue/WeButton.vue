<script setup lang="ts">
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
    background-color: var(--color-background);
    border: var(--size-1) solid var(--color-border);
    border-radius: var(--size-4);
    color: var(--color-primary);
    cursor: pointer;
    display: inline-flex;
    font-size: var(--size-14);
    gap: var(--size-4);
    justify-content: center;
    min-height: 2rem;
    min-width: 2rem;
    outline: none;
    padding: 0 var(--size-8);

    &:focus-visible,
    &:hover {
      border-color: var(--color-primary);
    }

    &.small {
      :deep(.material-symbols-rounded) {
        font-size: var(--size-16);
      }
    }

    &:disabled {
      pointer-events: none;

      :deep(.material-symbols-rounded) {
        opacity: 0.3;
      }
    }

    &.no-padding {
      padding: 0;
    }

    &.margin-left-auto {
      margin-left: auto;
    }
    
    :deep(.material-symbols-rounded) {
      font-size: var(--size-24);
    }
  }
</style>