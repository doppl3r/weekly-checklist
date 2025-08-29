<script setup>
  import { ref } from 'vue';
  import WeButton from './WeButton.vue';
  import WeInputDate from './WeInputDate.vue';

  const props = defineProps(['increment-selected-date', 'selected-date', 'update-selected-date'])
</script>

<template>
  <nav class="we-nav">
    <WeInputDate
      id="selected-date"
      :value="selectedDate"
      @change="updateSelectedDate($event.target.value)"
    />
    <WeButton>
      <span class="material-symbols-rounded">arrow_left_alt</span>
    </WeButton>
    <WeButton>
      <span class="material-symbols-rounded">arrow_right_alt</span>
    </WeButton>
    <WeButton>
      <span class="material-symbols-rounded">menu</span>
    </WeButton>
  </nav>
</template>

<style lang="scss" scoped>
  .we-nav {
    align-items: center;
    border-bottom: var(--color-border) calc(1rem / 16) solid;
    display: flex;
    gap: calc(1rem / 2);
    left: 0;
    padding: 1rem;
    position: sticky;
    top: 0;

    .we-button {
      &:last-of-type {
        margin-left: auto;
      }
    }
  }
</style>