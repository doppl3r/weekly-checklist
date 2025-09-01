<script setup>
  import '../scss/Global.scss';
  import '../scss/Fonts.scss';
  import { onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDates } from '../js/utils/use-dates.js';
  import { useModal } from '../js/utils/use-modal.js';
  import Modal from './Modal.vue';
  import WeNav from './WeNav.vue';
  import WeWeek from './WeWeek.vue';
  import WeSettings from './WeSettings.vue';

  const i18n = useI18n({ useScope: 'global' });

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
  } = useDates();

  // Initialize modal
  const {
    closeModal,
    openModal,
    modalIsOpen,
    modalActions,
    modalImage,
    modalText,
    modalTitle
  } = useModal();

  const modalSettings = {
    title: i18n.t('settings.title'),
    actions: [
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
  <div class="weekly-checklist">
    <WeNav
      :date="selectedDate"
      :increment="incrementSelectedDate"
      :today="today"
      :update="updateSelectedDate"
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
        :today="today"
        :update="updateWeekdays"
        :visibility="modalIsOpen"
      />
    </Modal>
  </div>
</template>

<style lang="scss" scoped>
  .weekly-checklist {
    display: flex;
    flex-direction: column;
    height: inherit;
  }
</style>