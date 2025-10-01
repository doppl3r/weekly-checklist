import { onMounted, ref, Ref } from 'vue';
import { useStorage } from './use-storage';

export const useSettings = () => {
  const themeRef: Ref<string> = ref('light');
  const { storage } = useStorage();

  const getTheme = async (): Promise<'light' | 'dark'> => {
    const result = await storage.get('weekly-checklist-theme');
    return String(result['weekly-checklist-theme']) === 'dark' ? 'dark' : 'light';
  };

  const setTheme = async (theme: 'light' | 'dark'): Promise<void> => {
    themeRef.value = theme;
    await storage.set({ 'weekly-checklist-theme': theme });
  }

  onMounted(async () => {
    themeRef.value = await getTheme();
  });

  return {
    getTheme,
    setTheme,
    themeRef
  };
}