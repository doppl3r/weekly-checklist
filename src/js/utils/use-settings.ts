import { onMounted, ref, Ref } from 'vue';
import { useStorage } from './use-storage';

export const useSettings = () => {
  const layoutRef: Ref<string> = ref('single');
  const themeRef: Ref<string> = ref('light');
  const { storage } = useStorage();

  const getLayout = async (): Promise<'single' | 'grid'> => {
    const result = await storage.get('weekly-checklist-layout');
    return String(result['weekly-checklist-layout']) === 'grid' ? 'grid' : 'single';
  };

  const getTheme = async (): Promise<'light' | 'dark'> => {
    const result = await storage.get('weekly-checklist-theme');
    return String(result['weekly-checklist-theme']) === 'dark' ? 'dark' : 'light';
  };

  const setLayout = async (layout: 'single' | 'grid'): Promise<void> => {
    layoutRef.value = layout;
    await storage.set({ 'weekly-checklist-layout': layout });
  };

  const setTheme = async (theme: 'light' | 'dark'): Promise<void> => {
    themeRef.value = theme;
    await storage.set({ 'weekly-checklist-theme': theme });
  };

  onMounted(async () => {
    layoutRef.value = await getLayout();
    themeRef.value = await getTheme();
  });

  return {
    getLayout,
    getTheme,
    setLayout,
    setTheme,
    layoutRef,
    themeRef
  };
};