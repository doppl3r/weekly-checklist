<script setup lang="ts">
  import { ref } from 'vue';

  interface Option {
    value: string | number;
    label: string;
  }

  const props = defineProps<{ options: Option[] }>();
</script>

<template>
  <select class="we-select">
    <option v-for="option in options" :key="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<style lang="scss" scoped>
  
</style>