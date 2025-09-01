<script setup>
  import { ref, watch } from 'vue';
  import WeProgressBar from './WeProgressBar.vue';
  
  const props = defineProps(['storage', 'visibility']);
  const storageCount = ref(0);

  watch(() => props.visibility, (after, before) => {
    if (after === true) {
      // Update item quota
      props.storage.getKeys().then(result => {
        storageCount.value = result.length;
      });
    }
  });
</script>

<template>
  <div class="we-settings">
    <label>Data</label>
    <p>The <a href="https://developer.chrome.com/docs/extensions/reference/api/storage#properties_4" target="_blank">Chrome Storage API</a> allows up to 512 checklists. If you are running low, you can clear previous checklists to save space.</p>
    <WeProgressBar :total="512" :value="storageCount" />
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