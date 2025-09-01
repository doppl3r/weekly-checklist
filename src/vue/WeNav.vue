<script setup>
  import WeButton from './WeButton.vue';
  import WeInputDate from './WeInputDate.vue';

  // Define props
  const emit = defineEmits(['open']);
  const props = defineProps(['date', 'increment', 'today', 'update']);
</script>

<template>
  <nav class="we-nav">
    <WeInputDate
      id="date"
      :value="date"
      @change="update($event.target.value)"
    />
    <WeButton
      :class="'no-padding'"
      :disabled="date === today"
      @click="update(today)"
    >
      <span class="material-symbols-rounded">today</span>
    </WeButton>
    <WeButton
      :class="'no-padding'"
      @click="increment(-7)"
    >
      <span class="material-symbols-rounded">arrow_left_alt</span>
    </WeButton>
    <WeButton
      :class="'no-padding'"
      @click="increment(7)"
    >
      <span class="material-symbols-rounded">arrow_right_alt</span>
    </WeButton>
    <WeButton
      :class="'no-padding'"
      @click="emit('open')"
    >
      <span class="material-symbols-rounded">menu</span>
    </WeButton>
  </nav>
</template>

<style lang="scss" scoped>
  .we-nav {
    align-items: center;
    background-color: var(--color-background);
    border-bottom: var(--color-border) var(--size-1) solid;
    display: flex;
    gap: var(--size-8);
    padding: 1rem;

    .we-button {
      &:last-of-type {
        margin-left: auto;
      }
    }
  }
</style>