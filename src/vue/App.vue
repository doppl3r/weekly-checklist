<script setup>
  import '../scss/Global.scss';
  import '../scss/Fonts.scss';
  import { useDates } from '../js/utils/use-dates.js';
  import { useStorage } from '../js/utils/use-storage.js';
  import WeNav from './WeNav.vue';
  import WeWeek from './WeWeek.vue';

  const {
    incrementSelectedDate,
    selectedDate,
    updateSelectedDate,
    updateWeekdays,
    weekdays
  } = useDates();
  const { storage } = useStorage();

  updateWeekdays();

  const test = async () => {
    await storage.set({ test: Date.now() });

    const result = await storage.get('test');
    console.log('GET test:', result);
  }

  test();
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