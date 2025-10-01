<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDates } from '../js/utils/use-dates';
  import { useModal } from '../js/utils/use-modal';
  import { useSettings } from '../js/utils/use-settings';
  import '../scss/Global.scss';
  import '../scss/Fonts.scss';
  import Modal from './Modal.vue';
  import WeNav from './WeNav.vue';
  import WeWeek from './WeWeek.vue';
  import WeSettings from './WeSettings.vue';

  const i18n = useI18n({ useScope: 'global' });
  const { setTheme, themeRef } = useSettings();

  // Initialize dates
  const {
    incrementSelectedDate,
    removeWeekday,
    setWeekday,
    selectedDate,
    storage,
    today,
    updateSelectedDate,
    updateWeekdays,
    weekdays,
    weekdaysUpdated
  }: ReturnType<typeof useDates> = useDates();

  // Initialize modal
  const {
    closeModal,
    openModal,
    modalIsOpen,
    modalActions,
    modalImage,
    modalText,
    modalTitle
  }: ReturnType<typeof useModal> = useModal();

  const modalSettings = {
    title: i18n.t('settings.title'),
    actions: [
      {
        icon: 'favorite',
        label: i18n.t('settings.actions.review'),
        callback: () => {
          window.open('https://chromewebstore.google.com/detail/weekly-checklist/gmdkpnbkljchgnklemhjdgehjcoibggn/reviews', '_blank');
        }
      },
      {
        label: i18n.t('settings.actions.close'),
        callback: () => closeModal()
      }
    ]
  };
  
  onMounted(async () => {
    // Initialize weekdays
    updateWeekdays();
  });
</script>

<template>
  <div
    :class="[ themeRef ]"
    class="weekly-checklist">
    <WeNav
      :date="selectedDate"
      :increment="incrementSelectedDate"
      :today="today"
      :theme="themeRef"
      :update="updateSelectedDate"
      @toggle-theme="setTheme(themeRef === 'light' ? 'dark' : 'light')"
      @open="openModal(modalSettings)"
    />
    <WeWeek
      :date="selectedDate"
      :today="today"
      :weekdays="weekdays"
      :weekdays-updated="weekdaysUpdated"
      @set="setWeekday"
      @remove="removeWeekday"
    />
    <Modal
      v-show="modalIsOpen"
      :title="modalTitle"
      :text="modalText"
      :image="modalImage"
      :actions="modalActions"
    >
      <WeSettings
        :storage="storage"
        :date="selectedDate"
        :update="updateWeekdays"
        :visibility="modalIsOpen"
      />
    </Modal>
  </div>
</template>

<style lang="scss" scoped>
  .weekly-checklist {
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    height: inherit;
  }
</style>