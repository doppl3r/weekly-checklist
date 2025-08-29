<script setup>
  import { ref } from 'vue';
  import AppButton from './AppButton.vue';
  import AppInputDate from './AppInputDate.vue';

</script>

<template>
  <nav>
    <AppInputDate />
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
  
</style>