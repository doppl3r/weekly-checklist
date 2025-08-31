<script setup>
  import { ref } from 'vue';
  import WeButton from './WeButton.vue';
  import WeInputDate from './WeInputDate.vue';

  const props = defineProps(['date', 'increment', 'update'])
</script>

<template>
  <nav class="we-nav">
    <WeInputDate
      id="date"
      :value="date"
      @change="update($event.target.value)"
    />
    <WeButton @click="increment(-7)">
      <span class="material-symbols-rounded">arrow_left_alt</span>
    </WeButton>
    <WeButton @click="increment(7)">
      <span class="material-symbols-rounded">arrow_right_alt</span>
    </WeButton>
    <WeButton>
      <span class="material-symbols-rounded">menu</span>
    </WeButton>
  </nav>
</template>

<style lang="scss" scoped>
  .we-nav {
    align-items: center;
    border-bottom: var(--color-border) var(--size-1) solid;
    display: flex;
    gap: var(--size-8);
    padding: 1rem;

    .we-button {
      &:last-of-type {
        margin-left: auto;
      }
    }
  }
</style>