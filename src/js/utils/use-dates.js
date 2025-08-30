import { ref } from 'vue';

export const useDates = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsOfYear = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDateKey = date => {
    return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  }

  const today = getDateKey(new Date());
  const selectedDate = ref(today);
  
  const updateSelectedDate = value => {
    console.log('Selected date updated to:', value);
    selectedDate.value = value;
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
  };
}