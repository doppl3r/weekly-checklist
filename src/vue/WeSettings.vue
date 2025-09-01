<script setup>
  import { ref } from 'vue';
  import WeProgressBar from './WeProgressBar.vue';
  
</script>

<template>
  <div class="we-settings">
    <label>Data</label>
    <p>The <a href="https://developer.chrome.com/docs/extensions/reference/api/storage#properties_4" target="_blank">Chrome Storage API</a> allows up to 512 checklists. If you are running low, you can clear previous checklists to save space.</p>
    <WeProgressBar :total="512" :value="13" />
  </div>
</template>

<style lang="scss" scoped>
  .we-settings {
    label {
      font-size: var(--size-14);
      font-weight: bold;
    }

    p {
      margin: var(--size-8) 0;
      font-size: var(--size-14);

      a {
        color: var(--color-link);
      }
    }
  }
</style>