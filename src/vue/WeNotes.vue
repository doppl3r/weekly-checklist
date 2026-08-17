<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import { Storage } from '../types/types.js';

  interface Props {
    storage: Storage;
    visibility: boolean;
  }

  const props = defineProps<Props>();

  const notesRef = ref<string>('');
  const getNotes = async (): Promise<string> => {
    const result = await props.storage.get('weekly-checklist-notes');
    const notes = result['weekly-checklist-notes'];
    return typeof notes === 'string' ? notes : '';
  };

  const refreshNotes = () => {
    getNotes().then(notes => {
      notesRef.value = notes;
    });
  }

  const setNotes = async (notes: string): Promise<void> => {
    notesRef.value = notes;
    await props.storage.set({ 'weekly-checklist-notes': notes });
  };

  onMounted(() => {
    refreshNotes();
  });

  // Update notes from parent visibility prop
  watch(() => props.visibility, isVisible => {
    if (isVisible) refreshNotes();
  });
</script>

<template>
  <div class="we-notes">
    <textarea rows="8" v-model="notesRef" @change="setNotes(notesRef)"></textarea>
  </div>
</template>

<style lang="scss" scoped>
  .we-notes {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);

    textarea {
      border: var(--size-1) solid var(--color-border);
      border-radius: var(--size-4);
      font-family: inherit;
      font-size: var(--size-14);
      height: auto;
      padding: var(--size-8);
      resize: none;
      width: 100%;

      &:focus {
        border-color: var(--color-primary);
        outline: none;
      }
    }

    p {
      margin: 0;
      font-size: var(--size-14);

      a {
        color: var(--color-link);
      }
    }
  }
</style>