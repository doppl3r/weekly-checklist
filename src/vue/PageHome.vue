<script setup>
  import { ref } from 'vue';
  import { useDates } from '../js/utils/use-dates.js';
  import AppNav from './AppNav.vue';

  const { selectedDate, updateSelectedDate } = useDates();
</script>

<template>
  <AppNav
    :selected-date="selectedDate"
    :update-selected-date="updateSelectedDate"
  />
</template>

<style lang="scss" scoped>
  
</style>