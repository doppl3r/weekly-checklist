<script setup>
  import { ref } from 'vue';
  import AppButton from './AppButton.vue';
  import AppInputDate from './AppInputDate.vue';

  const props = defineProps(['selected-date', 'update-selected-date'])
</script>

<template>
  <nav class="app-nav">
    <AppInputDate
      id="selected-date"
      :value="selectedDate"
      @change="updateSelectedDate($event.target.value)"
    />
    <AppButton>
      <span class="material-symbols-rounded">arrow_left_alt</span>
    </AppButton>
    <AppButton>
      <span class="material-symbols-rounded">arrow_right_alt</span>
    </AppButton>
    <AppButton>
      <span class="material-symbols-rounded">menu</span>
    </AppButton>
  </nav>
</template>

<style lang="scss" scoped>
  .app-nav {
    align-items: center;
    display: flex;
    gap: calc(1rem / 2);
    left: 0;
    padding: 1rem;
    position: sticky;
    top: 0;

    .app-button {
      &:last-of-type {
        margin-left: auto;
      }
    }
  }
</style>