<script setup>
  import { ref } from 'vue';

  const props = defineProps(['date']);
</script>

<template>
  <div class="we-week">
    <div class="we-week__day" v-for="day in 7" :key="day">
      Day {{ day }} - Selected Date: {{ date }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .we-week {
    display: flex;
    flex-direction: column;
    gap: calc(1rem / 2);
    overflow-y: auto;
    padding: 1rem;

    .we-week__day {
      border: calc(1rem / 16) solid var(--color-border);
      border-radius: calc(1rem / 4);
      padding: calc(1rem / 2);
    }
  }
</style>