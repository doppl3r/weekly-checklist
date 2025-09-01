import { ref } from 'vue';

export const useModal = () => {
  const modalActions = ref([]);
  const modalIsOpen = ref(false);
  const modalTitle = ref('');
  const modalText = ref('');
  const modalImage = ref('');

  const openModal = (options) => {
    modalActions.value = options.actions ?? [];
    modalIsOpen.value = true;
    modalTitle.value = options.title ?? '';
    modalText.value = options.text ?? '';
    modalImage.value = options.image ?? '';
  }

  const closeModal = () => {
    modalIsOpen.value = false;
  }

  return {
    closeModal,
    openModal,
    modalActions,
    modalIsOpen,
    modalText,
    modalTitle,
    modalImage,
  }
}