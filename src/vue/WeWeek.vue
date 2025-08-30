<script setup>
  import { ref } from 'vue';

  // Define props and state
  const props = defineProps(['date']);
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdays = ref({});

  // Generate weekdays based on provided date
  weekdayNames.forEach((name, index) => {
    // Get base date from date string
    const baseDate = new Date(props.date);
    baseDate.setHours(0, 0, 0, 0);

    // Extract target date using day index
    const currentDayIndex = baseDate.getDay();
    const targetDateOffset = index - currentDayIndex;
    const targetDate = new Date();
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

</script>

<template>
  <div class="we-week">
    <div class="we-week__day" v-for="(weekday, key) in weekdays" :key="key">
      <div class="we-week__day-checklist">
        <div class="we-week__day-checklist-item" v-for="(item, index) in weekday.checklist" :key="index">
          <div class="we-week__day-checklist-item-checkbox">
            <input type="checkbox" :id="`check-${key}-${index}`" v-model="item.checked" />
            <label :for="`check-${key}-${index}`"></label>
          </div>
          <div class="we-week__day-checklist-item-text">
            <input :class="{ completed: item.checked }" :id="`text-${key}-${index}`" type="text" v-model="item.text" />
            <label :for="`text-${key}-${index}`"></label>
          </div>
        </div>
      </div>
      <div class="we-week__day-label">{{ weekday.label }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .we-week {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    overflow-y: auto;
    padding: 1rem;
    
    .we-week__day {
      border: var(--size-1) solid var(--color-border);
      border-radius: var(--size-4);
      font-size: var(--size-14);
      padding: var(--size-4) 0;
      position: relative;

      .we-week__day-checklist {
        display: flex;
        flex-direction: column;

        .we-week__day-checklist-item {
          align-items: center;
          display: flex;

          .we-week__day-checklist-item-checkbox {
            align-items: center;
            cursor: pointer;
            display: flex;
            justify-content: center;
            position: relative;
            
            input {
              cursor: inherit;
              height: var(--size-24);
              margin: 0;
              opacity: 0;
              width: var(--size-24);
            }

            input:checked + label {
              background-color: var(--color-primary);
              border-color: var(--color-primary);
            }

            input:focus-visible + label,
            input:hover + label {
              background-color: var(--color-border);
            }

            input:checked:focus-visible + label,
            input:checked:hover + label {
              background-color: var(--color-primary);
            }

            label {
              border: var(--size-1) solid var(--color-border);
              border-radius: var(--size-4);
              cursor: inherit;
              display: block;
              height: var(--size-12);
              position: absolute;
              width: var(--size-12);
            }
          }

          .we-week__day-checklist-item-text {
            flex-grow: 1;
            position: relative;

            input {
              border-width: 0;
              color: var(--color-text);
              line-height: 1.5rem;
              outline: none;
              padding: 0;
              width: 100%;

              &.completed {
                color: var(--color-disabled);
                text-decoration: line-through;
              }
            }

            label {
              display: none;
            }
          }
        }
      }

      .we-week__day-label {
        line-height: 1.5rem;
        position: absolute;
        right: var(--size-8);
        top: var(--size-4);
      }
    }
  }
</style>