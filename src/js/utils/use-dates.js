import { ref } from 'vue';

export const useDates = () => {
  const getDateKey = date => {
    return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  }

  const today = getDateKey(new Date());
  const selectedDate = ref(today);
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdays = ref({});

  const updateWeekdays = () => {
    // Empty weekdays object
    weekdays.value = {};

    // Generate weekdays based on provided date
    weekdayNames.forEach((name, index) => {
      // Get base date from date string (use local midnight)
      const selectedDateTime = selectedDate.value + 'T00:00:00';
      const baseDate = new Date(selectedDateTime);

      // Extract target date using day index
      const currentDayIndex = baseDate.getDay();
      const targetDateOffset = index - currentDayIndex;
      const targetDate = new Date(selectedDateTime);
      targetDate.setDate(baseDate.getDate() + targetDateOffset);

      // Format label as "Mon, Aug. 25"
      const shortWeekday = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
      const shortMonth = targetDate.toLocaleDateString('en-US', { month: 'short' });
      const dayNumber = targetDate.getDate();
      const label = `${shortWeekday}, ${shortMonth}. ${dayNumber}`;

      // Get key from target date (without time)
      const key = targetDate.toISOString().slice(0, 10);

      // Assign new weekday array item
      weekdays.value[key] = { name, label, checklist: [{ text: 'Test', checked: false }, { text: 'Test', checked: false }] };
    });
  }
  
  const updateSelectedDate = value => {
    selectedDate.value = value;
    updateWeekdays();
  }

  const incrementSelectedDate = days => {
    const currentDate = new Date(selectedDate.value);
    currentDate.setDate(currentDate.getDate() + days);
    updateSelectedDate(getDateKey(currentDate));
  }

  return {
    incrementSelectedDate,
    selectedDate,
    updateSelectedDate,
    updateWeekdays,
    weekdays
  };
}