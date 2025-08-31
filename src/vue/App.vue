<script setup>
  import '../scss/Global.scss';
  import '../scss/Fonts.scss';
  import { useDates } from '../js/utils/use-dates.js';
  import { useStorage } from '../js/utils/use-storage.js';
  import WeNav from './WeNav.vue';
  import WeWeek from './WeWeek.vue';

  const { selectedDate, updateSelectedDate } = useDates();
  const { get, set } = useStorage();

  const test = async () => {
    await set({ test: Date.now() });

    const result = await get('test');
    console.log('GET test:', result);
  }

  test();
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