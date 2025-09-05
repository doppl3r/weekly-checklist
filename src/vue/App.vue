<script setup lang="ts">
  import type { Ref } from 'vue';
  import type { Weekdays } from '../js/utils/use-dates';
  import type { Storage } from '../js/utils/use-storage';
  import '../scss/Global.scss';
  import '../scss/Fonts.scss';
  import { onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDates } from '../js/utils/use-dates';
  import { useModal } from '../js/utils/use-modal';
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
  }: {
    incrementSelectedDate: (days: number) => void;
    removeWeekday: (key: string | string[]) => void;
    setWeekday: (items: Record<string, any[]>) => void;
    selectedDate: Ref<string>;
    storage: Storage;
    today: string;
    updateSelectedDate: (value: string) => void;
    updateWeekdays: () => void;
    weekdays: Ref<Weekdays>;
    weekdaysUpdated: Ref<boolean>;
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
  }: {
    closeModal: () => void;
    openModal: (options: any) => void;
    modalIsOpen: Ref<boolean>;
    modalActions: Ref<any[]>;
    modalImage: Ref<string>;
    modalText: Ref<string>;
    modalTitle: Ref<string>;
  } = useModal();

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
        :date="selectedDate"
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