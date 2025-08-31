<script setup>
  import '../scss/Global.scss';
  import '../scss/Fonts.scss';
  import { useDates } from '../js/utils/use-dates.js';
  import { onMounted } from 'vue';
  import WeNav from './WeNav.vue';
  import WeWeek from './WeWeek.vue';

  // Initialize composables
  const {
    incrementSelectedDate,
    removeWeekday,
    saveWeekday,
    selectedDate,
    today,
    updateSelectedDate,
    updateWeekdays,
    weekdays
  } = useDates();
  
  onMounted(async () => {
    // Initialize weekdays
    updateWeekdays();
  });
</script>

<template>
  <div class="weekly-checklist">
    <WeNav
      :date="selectedDate"
      :increment="incrementSelectedDate"
      :today="today"
      :update="updateSelectedDate"
    />
    <WeWeek
      :date="selectedDate"
      :weekdays="weekdays"
      @save="saveWeekday"
      @remove="removeWeekday"
    />
  </div>
</template>

<style lang="scss" scoped>
  .weekly-checklist {
    display: flex;
    flex-direction: column;
    height: inherit;
  }
</style>