<script setup>
  import '../scss/Global.scss';
  import '../scss/Fonts.scss';
  import { useDates } from '../js/utils/use-dates.js';
  import { useStorage } from '../js/utils/use-storage.js';
  import { onMounted } from 'vue';
  import WeNav from './WeNav.vue';
  import WeWeek from './WeWeek.vue';

  // Initialize composables
  const { incrementSelectedDate, selectedDate, updateSelectedDate, updateWeekdays, weekdays } = useDates();
  const { storage } = useStorage();

  onMounted(() => {
    // Initialize weekdays
    updateWeekdays();
  });
</script>

<template>
  <div class="weekly-checklist">
    <WeNav
      :date="selectedDate"
      :increment="incrementSelectedDate"
      :update="updateSelectedDate"
    />
    <WeWeek
      :date="selectedDate"
      :weekdays="weekdays"
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