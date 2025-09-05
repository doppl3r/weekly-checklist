import { ref, Ref } from 'vue';
import { ModalAction, ModalOptions } from '../../types/types';

export const useModal = () => {
  const modalActions: Ref<ModalAction[]> = ref([]);
  const modalIsOpen: Ref<boolean> = ref(false);
  const modalTitle: Ref<string> = ref('');
  const modalText: Ref<string> = ref('');
  const modalImage: Ref<string> = ref('');

  const openModal = (options: ModalOptions): void => {
    modalActions.value = options.actions ?? [];
    modalIsOpen.value = true;
    modalTitle.value = options.title ?? '';
    modalText.value = options.text ?? '';
    modalImage.value = options.image ?? '';
  };

  const closeModal = (): void => {
    modalIsOpen.value = false;
  };

  return {
    closeModal,
    openModal,
    modalActions,
    modalIsOpen,
    modalText,
    modalTitle,
    modalImage,
  };
};