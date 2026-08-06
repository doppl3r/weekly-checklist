<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue';
  import { ChecklistItem, Weekdays } from '../types/types';
  import { useI18n } from 'vue-i18n';

  const i18n = useI18n({ useScope: 'global' });

  // Helper methods for safe selection access
  function getSelectionStart(event: Event): number {
    const input = event.target as HTMLInputElement | null;
    return input?.selectionStart ?? 0;
  }

  function getSelectionEnd(event: Event): number {
    const input = event.target as HTMLInputElement | null;
    return input?.selectionEnd ?? 0;
  }

  interface Props {
    date: string;
    today: string;
    weekdays: Weekdays;
    weekdaysUpdated: boolean;
    storage: any;
  }

  const emit = defineEmits<{
    (e: 'remove', key: string): void;
    (e: 'set', payload: Record<string, ChecklistItem[]>): void;
  }>();
  const props = defineProps<Props>();
  const weekdaysRef = ref<HTMLElement | null>(null);

const onEnter = (
  key: string,
  indexDay: number,
  indexItem: number,
  checklist: ChecklistItem[],
  e: KeyboardEvent
) => {
  const selectionStart = getSelectionStart(e);
  const currentText = checklist[indexItem].text;
  const before = currentText.slice(0, selectionStart);
  const after = currentText.slice(selectionStart);
  checklist[indexItem].text = before;
  checklist.splice(indexItem + 1, 0, { text: after, checked: false });
  focusItem(indexDay, indexItem + 1, 0, 0);
  emit('set', { [key]: checklist });
};

const onBackspace = ( key: string, indexDay: number, indexItem: number, checklist: ChecklistItem[], e: KeyboardEvent) => {
  const input = e.target as HTMLInputElement | null;
  if (input && input.selectionStart === 0 && input.selectionEnd === 0) {
    if (indexItem > 0) {
      // Merge with previous item if not the first
      e.preventDefault();
      const start = checklist[indexItem - 1].text.length;
      const end = checklist[indexItem - 1].text.length;
      checklist[indexItem - 1].text += input.value;
      checklist.splice(indexItem, 1);
      focusItem(indexDay, indexItem - 1, start, end);
      emit('set', { [key]: checklist });
    } else {
      if (checklist[0].text === '') {
        // Remove checklist from storage if checklist only has one empty item
        if (checklist.length === 1) {
          emit('remove', key);
        } else {
          // Only remove first item if multiple items exist
          checklist.splice(0, 1);
          focusItem(indexDay, 0, 0, 0);
          emit('set', { [key]: checklist });
        }
      }
    }
  }
};

const addItem = (key: string, indexDay: number, indexItem: number, checklist: ChecklistItem[]) => {
  checklist.splice(indexItem + 1, 0, { text: '', checked: false });
  focusItem(indexDay, indexItem + 1, 0, 0);
  emit('set', { [key]: checklist });
};

const onDelete = (key: string, indexDay: number, indexItem: number, checklist: ChecklistItem[], e: KeyboardEvent) => {
  const input = e.target as HTMLInputElement | null;
  const isDeleteKey = e.key === 'Delete';
  const isLastItem = indexItem === checklist.length - 1;
  const isSelectingEnd = input ? input.selectionStart === input.value.length : false;
  if (isDeleteKey && !isLastItem && isSelectingEnd) {
    e.preventDefault();
    const start = checklist[indexItem].text.length;
    const end = checklist[indexItem].text.length;
    checklist[indexItem].text += checklist[indexItem + 1].text;
    checklist.splice(indexItem + 1, 1);
    focusItem(indexDay, indexItem, start, end);
    emit('set', { [key]: checklist });
  }
};

  const focusItem = (indexDay: number, indexItem: number, start: number = 0, end: number = 0) => {
    nextTick(() => {
      const parent = weekdaysRef.value;
      const checklistLength = props.weekdays[Object.keys(props.weekdays)[indexDay]].checklist.length;
      if (!parent) return;
      if (indexItem < 0) {
        indexItem = 0;
        start = 0;
        end = 0;
      }
      else if (indexItem > checklistLength - 1) {
        indexItem = checklistLength - 1;
        const textLength = props.weekdays[Object.keys(props.weekdays)[indexDay]].checklist[indexItem].text.length;
        start = textLength;
        end = textLength;
      }
      const elem = parent.querySelector(`#text-${indexDay}-${indexItem}`) as HTMLInputElement | null;
      if (elem) {
        elem.focus();
        elem.setSelectionRange(start, end);
      }
    });
  };

  watch(() => props.weekdaysUpdated, after => {
    if (after === true) {
      scrollToToday();
    }
  });

  const scrollToToday = () => {
    nextTick(() => {
      const parent = weekdaysRef.value;
      if (!parent) return;
      const elem = parent.querySelector('.we-week__day.today') as HTMLElement | null;
      elem?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const shiftItem = (key: string, indexDay: number, indexItem: number, checklist: ChecklistItem[], direction: -1 | 1, e: MouseEvent) => {
    // Read the cursor position before the click blurs the input, so we can restore it
    const input = weekdaysRef.value?.querySelector(`#text-${indexDay}-${indexItem}`) as HTMLInputElement | null;
    const start = input?.selectionStart ?? 0;
    const end = input?.selectionEnd ?? 0;

    // Shift held forces moving to the adjacent day, skipping the same-day reorder
    const forceDayShift = e.shiftKey;

    // Calculate the new index within the current day's checklist
    const newIndexInDay = indexItem + direction;

    // Reorder within the same day, unless the user held Shift to force moving to the adjacent day
    if (!forceDayShift && newIndexInDay >= 0 && newIndexInDay < checklist.length) {
      [checklist[indexItem], checklist[newIndexInDay]] = [checklist[newIndexInDay], checklist[indexItem]];
      focusItem(indexDay, newIndexInDay, start, end);
      emit('set', { [key]: checklist });
      return;
    }

    // Compute the adjacent calendar day - Date handles week/month/year rollover for us
    const targetDate = new Date(key + 'T00:00:00');
    targetDate.setDate(targetDate.getDate() + direction);
    const year = targetDate.getFullYear();
    const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
    const day = targetDate.getDate().toString().padStart(2, '0');
    const targetKey = `${year}-${month}-${day}`;
    const item = checklist.splice(indexItem, 1)[0];

    // Keep a blank placeholder so the day isn't left with zero items to render
    if (checklist.length === 0) checklist.push({ text: '', checked: false });

    // Find the index of the target day in the weekdays object
    const targetDayIndex = Object.keys(props.weekdays).indexOf(targetKey);

    // Check if the target day is within the currently displayed week
    if (targetDayIndex !== -1) {
      const targetChecklist = props.weekdays[targetKey].checklist;
      if (direction === 1) {
        if (forceDayShift) {
          // Always append to the end of the target day
          targetChecklist.push(item);
        }
        else {
          targetChecklist.unshift(item);
          focusItem(targetDayIndex, 0, start, end);
        }
      }
      else {
        if (forceDayShift) {
          // Always prepend to the start of the target day
          targetChecklist.unshift(item);
        }
        else {
          targetChecklist.push(item);
          focusItem(targetDayIndex, targetChecklist.length - 1, start, end);
        }
      }

      // Persist both the current day and target day changes
      emit('set', { [key]: checklist, [targetKey]: targetChecklist });
    }
    else {
      // Target day is outside the currently displayed week
      props.storage.get(targetKey).then((result: Record<string, ChecklistItem[]>) => {
        const targetChecklist = Array.isArray(result[targetKey]) ? result[targetKey] : [{ text: '', checked: false }];
        if (direction === 1) targetChecklist.unshift(item);
        else targetChecklist.push(item);
        emit('set', { [targetKey]: targetChecklist });
      });

      // Persist the current day changes
      emit('set', { [key]: checklist });
    }
  };
</script>

<template>
  <div class="we-week" ref="weekdaysRef">
    <div class="we-week__day"
      v-for="(weekday, key, indexDay) in weekdays"
      :class="{ today: today === key }"
      :key="key"
    >
      <div class="we-week__day-label">{{ weekday.label }}</div>
      <div class="we-week__day-checklist">
        <div class="we-week__day-checklist-item" v-for="(item, indexItem) in weekday.checklist" :key="indexItem">
          <div class="we-week__day-checklist-item-checkbox">
            <input
              :id="`check-${indexDay}-${indexItem}`"
              :title="item.checked ? i18n.t('checklist.mark_incomplete') : i18n.t('checklist.mark_complete')"
              @change="emit('set', { [key]: weekday.checklist })"
              type="checkbox"
              v-model="item.checked"
            />
            <label :for="`check-${indexDay}-${indexItem}`">
              <span class="material-symbols-rounded">check</span>
            </label>
          </div>
          <div class="we-week__day-checklist-item-text">
            <input
              :class="{ completed: item.checked }"
              :id="`text-${indexDay}-${indexItem}`"
              @change="emit('set', { [key]: weekday.checklist })"
              @keydown.arrow-down.prevent="focusItem(indexDay, indexItem + 1, getSelectionStart($event), getSelectionEnd($event))"
              @keydown.arrow-up.prevent="focusItem(indexDay, indexItem - 1, getSelectionStart($event), getSelectionEnd($event))"
              @keydown.backspace="onBackspace(key, indexDay, indexItem, weekday.checklist, $event)"
              @keydown.delete.exact="onDelete(key, indexDay, indexItem, weekday.checklist, $event)"
              @keydown.enter="onEnter(key, indexDay, indexItem, weekday.checklist, $event)"
              type="text"
              autocomplete="off"
              v-model="item.text"
            />
          </div>
          <div class="we-week__day-checklist-item-actions">
            <button
              :title="i18n.t('checklist.add_item')"
              @click="addItem(key, indexDay, indexItem, weekday.checklist)"
            >
              <span class="material-symbols-rounded">add</span>
            </button>
            <button
              :title="i18n.t('checklist.move_item_up')"
              @click="shiftItem(key, indexDay, indexItem, weekday.checklist, -1, $event)"
            >
              <span class="material-symbols-rounded">keyboard_arrow_up</span>
            </button>
            <button
              :title="i18n.t('checklist.move_item_down')"
              @click="shiftItem(key, indexDay, indexItem, weekday.checklist, 1, $event)"
            >
              <span class="material-symbols-rounded">keyboard_arrow_down</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .we-week {
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    overflow-y: auto;
    padding: 1rem;
    scroll-padding: var(--size-16);
    
    .we-week__day {
      border: var(--size-1) solid var(--color-border);
      border-radius: var(--size-4);
      font-size: var(--size-14);
      padding: var(--size-4) 0;
      position: relative;

      &.today {
        border-color: var(--color-primary);
      }

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
              background-color: var(--color-disabled);
            }

            label {
              border: var(--size-1) solid var(--color-border);
              border-radius: var(--size-4);
              cursor: inherit;
              display: block;
              height: var(--size-12);
              pointer-events: none;
              position: absolute;
              width: var(--size-12);

              .material-symbols-rounded {
                color: var(--color-background);
                font-size: var(--size-12);
                left: 50%;
                position: absolute;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }

          .we-week__day-checklist-item-text {
            align-items: center;
            display: flex;
            flex-grow: 1;
            position: relative;

            input {
              background-color: var(--color-background);
              border-width: 0;
              color: var(--color-primary);
              font-family: inherit;
              line-height: var(--size-24);
              outline: none;
              padding: 0;
              width: 100%;

              &::selection {
                background: var(--color-primary);
                color: var(--color-background);
              }

              &.completed {
                color: var(--color-disabled);
                text-decoration: line-through;
              }
            }

            label {
              display: none;
            }
          }

          &:hover {
            .we-week__day-checklist-item-actions {
              display: flex;
            }
          }

          .we-week__day-checklist-item-actions {
            display: none;
            gap: var(--size-2);
            padding: 0 var(--size-4);
            
            button {
              align-items: center;
              background: transparent;
              border: var(--size-1) solid var(--color-border);
              border-radius: var(--size-4);
              cursor: pointer;
              display: flex;
              outline: none;
              padding: 0;

              &:hover,
              &:focus-visible {
                border-color: var(--color-primary);
              }

              span {
                color: var(--color-primary);
                font-size: var(--size-16);
              }
            }
          }
        }
      }

      .we-week__day-label {
        color: var(--color-link);
        font-size: var(--size-10);
        letter-spacing: var(--size-1);
        line-height: var(--size-16);
        padding: 0 var(--size-4);
        text-transform: uppercase;
      }
    }
  }
</style>