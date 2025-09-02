<script setup>
  import WeButton from './WeButton.vue';
  import WeInputDate from './WeInputDate.vue';
  import { useI18n } from 'vue-i18n';

  const i18n = useI18n({ useScope: 'global' });

  // Define props
  const emit = defineEmits(['open']);
  const props = defineProps(['date', 'increment', 'today', 'update']);
</script>

<template>
  <nav class="we-nav">
    <WeInputDate
      id="date"
      :value="date"
      :title="i18n.t('navigation.view_calendar')"
      @change="update($event.target.value)"
    />
    <WeButton
      :class="'no-padding'"
      :disabled="date === today"
      :title="i18n.t('navigation.jump_to_today')"
      @click="update(today)"
    >
      <span class="material-symbols-rounded">today</span>
    </WeButton>
    <WeButton
      :class="'no-padding'"
      :title="i18n.t('navigation.view_previous_week')"
      @click="increment(-7)"
    >
      <span class="material-symbols-rounded">arrow_left_alt</span>
    </WeButton>
    <WeButton
      :class="'no-padding'"
      :title="i18n.t('navigation.view_next_week')"
      @click="increment(7)"
    >
      <span class="material-symbols-rounded">arrow_right_alt</span>
    </WeButton>
    <WeButton
      :class="'no-padding'"
      :title="i18n.t('navigation.open_menu')"
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