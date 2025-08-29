<script setup>
  import { ref } from 'vue';
  import { useDates } from '../js/utils/use-dates.js';
  import WeNav from './WeNav.vue';
  import WeWeek from './WeWeek.vue';

  const { selectedDate, updateSelectedDate } = useDates();
</script>

<template>
  <div class="weekly-checklist">
    <WeNav
      :date="selectedDate"
      :update="updateSelectedDate"
    />
    <WeWeek :date="selectedDate" />
  </div>
</template>

<style lang="scss" scoped>
  .weekly-checklist {
    display: flex;
    flex-direction: column;
    height: inherit;
  }
</style>