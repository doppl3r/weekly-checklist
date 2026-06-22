<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDates } from '../js/utils/use-dates';
  import { useModal } from '../js/utils/use-modal';
  import { useSettings } from '../js/utils/use-settings';
  import '../scss/Global.scss';
  import '../scss/Fonts.scss';
  import Modal from './Modal.vue';
  import WeNav from './WeNav.vue';
  import WeWeek from './WeWeek.vue';
  import WeButton from './WeButton.vue';
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

  const buttonReview = ref({
    icon: 'favorite',
    label: i18n.t('settings.actions.review'),
    visible: true,
    callback: () => {
      window.open('https://chromewebstore.google.com/detail/weekly-checklist/gmdkpnbkljchgnklemhjdgehjcoibggn/reviews', '_blank');
    }
  });
  const buttonClose = ref({
    label: i18n.t('settings.actions.close'),
    callback: () => closeModal()
  });
  const modalSettings = {
    title: i18n.t('settings.title'),
    actions: [
      buttonReview.value,
      buttonClose.value
    ]
  };

  const hideReviewButton = () => {
    buttonReview.value.visible = false;
  };
  
  onMounted(async () => {
    // Initialize weekdays
    updateWeekdays();
  });
</script>

<template>
  <div
    :class="[ themeRef ]"
    class="weekly-checklist"
    @click="hideReviewButton"
  >
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
    <WeButton
      class="button-review"
      @click="buttonReview.callback"
      v-if="buttonReview.visible"
    >
      <span class="material-symbols-rounded">favorite</span>
      <span>Write a Review</span>
    </WeButton>
  </div>
</template>

<style lang="scss" scoped>
  .weekly-checklist {
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    height: inherit;
  }

  .button-review {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
</style>