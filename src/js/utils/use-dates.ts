import { ref, Ref } from 'vue';
import { useStorage } from './use-storage';
import { ChecklistItem, Weekday, Weekdays } from '../../types/types';

export const useDates = () => {
  // Initialize composables
  const { storage } = useStorage();

  const getDateFromKey = (str?: string): Date => {
    if (str === undefined) return new Date(new Date().setHours(0, 0, 0, 0));
    return new Date(str + 'T00:00:00');
  };

  // Convert date to "YYYY-MM-DD" format
  const getKeyFromDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Define state
  const today: string = getKeyFromDate(getDateFromKey());
  const selectedDate: Ref<string> = ref(today);
  const weekdayNames: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdays: Ref<Weekdays> = ref({});
  const weekdaysUpdated: Ref<boolean> = ref(false);

  const updateWeekdays = (): void => {
    // Empty weekdays object
    weekdays.value = {};

    // Generate weekdays based on provided date
    weekdayNames.forEach((name, index) => {
      // Get base date from date string (use local midnight)
      const baseDate = getDateFromKey(selectedDate.value);

      // Extract target date using day index
      const currentDayIndex = baseDate.getDay();
      const targetDateOffset = index - currentDayIndex;
      const targetDate = getDateFromKey(selectedDate.value);
      targetDate.setDate(baseDate.getDate() + targetDateOffset);

      // Format label as "Mon, Aug. 25"
      const shortWeekday = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
      const shortMonth = targetDate.toLocaleDateString('en-US', { month: 'short' });
      const dayNumber = targetDate.getDate();
      const label = `${shortWeekday}, ${shortMonth}. ${dayNumber}`;

      // Get key from target date (without time)
      const key = getKeyFromDate(targetDate);

      // Assign new weekday array item
      weekdays.value[key] = { name, label, checklist: [{ text: '', checked: false }] };
    });

    // Set initial weekdays updated state
    weekdaysUpdated.value = false;

    // Load all weekday checklists from storage using a single array of keys
    const keys = Object.keys(weekdays.value);
    storage.get(keys).then((result: Record<string, ChecklistItem[]>) => {
      keys.forEach(key => {
        const checklist = result[key];
        if (Array.isArray(checklist)) {
          // Clear default empty item
          weekdays.value[key].checklist.length = 0;

          // Populate checklist with loaded items
          checklist.forEach(item => {
            weekdays.value[key].checklist.push(item);
          });
        }
      });

      // Update weekdays loading state
      weekdaysUpdated.value = true;
    });
  };

  const setWeekday = (items: Record<string, ChecklistItem[]>): void => {
    const parsedItems = JSON.parse(JSON.stringify(items));
    const values = Object.values(parsedItems)[0] as ChecklistItem[];
    const hasText = values.some((item: ChecklistItem) => item.text !== '');

    // Save to storage only if there's at least one item with text
    if (hasText) storage.set(parsedItems);
    else removeWeekday(Object.keys(items));
  };

  const removeWeekday = (key: string | string[]): void => {
    storage.remove(key);
  };

  const updateSelectedDate = (value: string): void => {
    selectedDate.value = value;
    updateWeekdays();
  };

  const incrementSelectedDate = (days: number): void => {
    // Get the current date from selected date
    const currentDate = getDateFromKey(selectedDate.value);
    currentDate.setDate(currentDate.getDate() + days);

    // Update selected date from incremented date
    const nextDateKey = getKeyFromDate(currentDate);
    updateSelectedDate(nextDateKey);
  };

  return {
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
  };
};