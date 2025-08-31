import { ref } from 'vue';
import { useStorage } from './use-storage.js';

export const useDates = () => {
  // Initialize composables
  const { storage } = useStorage();

  // Define state
  const today = new Date().toISOString().slice(0, 10);
  const selectedDate = ref(today);
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdays = ref({});

  const updateWeekdays = () => {
    // Empty weekdays object
    weekdays.value = {};

    // Generate weekdays based on provided date
    weekdayNames.forEach((name, index) => {
      // Get base date from date string (use local midnight)
      const selectedDateMidnight = selectedDate.value + 'T00:00:00';
      const baseDate = new Date(selectedDateMidnight);

      // Extract target date using day index
      const currentDayIndex = baseDate.getDay();
      const targetDateOffset = index - currentDayIndex;
      const targetDate = new Date(selectedDateMidnight);
      targetDate.setDate(baseDate.getDate() + targetDateOffset);

      // Format label as "Mon, Aug. 25"
      const shortWeekday = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
      const shortMonth = targetDate.toLocaleDateString('en-US', { month: 'short' });
      const dayNumber = targetDate.getDate();
      const label = `${shortWeekday}, ${shortMonth}. ${dayNumber}`;

      // Get key from target date (without time)
      const key = targetDate.toISOString().slice(0, 10);

      // Assign new weekday array item
      weekdays.value[key] = { name, label, checklist: [] };
    });

    // Load all weekday checklists from storage using a single array of keys
    const keys = Object.keys(weekdays.value);
    storage.get(keys).then(result => {
      keys.forEach(key => {
        const checklist = result[key];
        if (Array.isArray(checklist)) {
          checklist.forEach(item => {
            weekdays.value[key].checklist.push(item);
          });
        }
        else {
          weekdays.value[key].checklist.push({ text: '', checked: false });
        }
      });
    });
  }

  const saveWeekday = items => {
    const parsedItems = JSON.parse(JSON.stringify(items));
    const values = Object.values(parsedItems)[0];
    const hasText = values.some(item => item.text !== '');

    // Save to storage only if there's at least one item with text
    if (hasText) storage.set(parsedItems);
  }

  const removeWeekday = key => {
    storage.remove(key); 
  }
  
  const updateSelectedDate = value => {
    selectedDate.value = value;
    updateWeekdays();
  }

  const incrementSelectedDate = days => {
    const currentDate = new Date(selectedDate.value);
    currentDate.setDate(currentDate.getDate() + days);
    updateSelectedDate(currentDate.toISOString().slice(0, 10));
  }

  return {
    incrementSelectedDate,
    removeWeekday,
    saveWeekday,
    selectedDate,
    today,
    updateSelectedDate,
    updateWeekdays,
    weekdays
  };
}