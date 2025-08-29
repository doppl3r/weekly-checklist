<script setup>
  import { ref } from 'vue';
  import { useDates } from '../js/utils/use-dates.js';
  import WeNav from './WeNav.vue';

  const { selectedDate, updateSelectedDate } = useDates();
</script>

<template>
  <WeNav
    :selected-date="selectedDate"
    :update-selected-date="updateSelectedDate"
  />

</template>

<style lang="scss" scoped>
  
</style>