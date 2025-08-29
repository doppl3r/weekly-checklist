<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    options: {
      type: Array,
      required: true
    }
  });
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