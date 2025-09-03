<script setup>
  import { nextTick, ref, watch } from 'vue';

  // Define props and state
  const emit = defineEmits(['remove', 'set']);
  const props = defineProps(['date', 'today', 'weekdays', 'weekdays-updated']);
  const weekdaysRef = ref();

  const onEnter = (key, indexDay, indexItem, checklist, e) => {
    const selectionStart = e.target.selectionStart;
    const currentText = checklist[indexItem].text;
    const before = currentText.slice(0, selectionStart);
    const after = currentText.slice(selectionStart);
    checklist[indexItem].text = before;
    checklist.splice(indexItem + 1, 0, { text: after, checked: false });
    focusItem(indexDay, indexItem + 1, 0, 0);
    emit('set', { [key]: checklist });
  };

  const onBackspace = (key, indexDay, indexItem, checklist, e) => {
    if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
      if (indexItem > 0) {
        // Merge with previous item if not the first
        e.preventDefault();
        const start = checklist[indexItem - 1].text.length;
        const end = checklist[indexItem - 1].text.length;
        checklist[indexItem - 1].text += e.target.value;
        checklist.splice(indexItem, 1);
        focusItem(indexDay, indexItem - 1, start, end);
        emit('set', { [key]: checklist });
      }
      else {
        if (checklist[0].text === '') {
          // Remove checklist from storage if checklist only has one empty item
          if (checklist.length === 1) {
            emit('remove', key);
          }
          else {
            // Only remove first item if multiple items exist
            checklist.splice(0, 1);
            focusItem(indexDay, 0, 0, 0);
            emit('set', { [key]: checklist });
          }
        }
      }
    }
  };

  const onDelete = (key, indexDay, indexItem, checklist, e) => {
    const isDeleteKey = e.key === 'Delete';
    const isLastItem = indexItem === checklist.length - 1;
    const isSelectingEnd = e.target.selectionStart === e.target.value.length;

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

  const focusItem = (indexDay, indexItem, start = 0, end = 0) => {
    nextTick(() => {  
      const elem = weekdaysRef.value.querySelector(`#text-${indexDay}-${indexItem}`);
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
      const elem = weekdaysRef.value.querySelector(`.we-week__day.today`);
      elem?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };
</script>

<template>
  <div class="we-week" ref="weekdaysRef">
    <div class="we-week__day"
      v-for="(weekday, key, indexDay) in weekdays"
      :class="{ today: today === key }"
      :key="key"
    >
      <div class="we-week__day-checklist">
        <div class="we-week__day-checklist-item" v-for="(item, indexItem) in weekday.checklist" :key="indexItem">
          <div class="we-week__day-checklist-item-checkbox">
            <input
              :id="`check-${indexDay}-${indexItem}`"
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
              @keydown.arrow-down.prevent="focusItem(indexDay, indexItem + 1, $event.target.selectionStart, $event.target.selectionEnd)"
              @keydown.arrow-up.prevent="focusItem(indexDay, indexItem - 1, $event.target.selectionStart, $event.target.selectionEnd)"
              @keydown.backspace="onBackspace(key, indexDay, indexItem, weekday.checklist, $event)"
              @keydown.delete.exact="onDelete(key, indexDay, indexItem, weekday.checklist, $event)"
              @keydown.enter="onEnter(key, indexDay, indexItem, weekday.checklist, $event)"
              type="text"
              autocomplete="off"
              v-model="item.text"
            />
          </div>
        </div>
      </div>
      <div class="we-week__day-label">{{ weekday.label }}</div>
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
              color: var(--color-text);
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
        }
      }

      .we-week__day-label {
        line-height: var(--size-24);
        position: absolute;
        right: var(--size-8);
        top: var(--size-4);
      }
    }
  }
</style>