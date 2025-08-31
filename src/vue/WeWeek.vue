<script setup>
  import { nextTick, onMounted, ref } from 'vue';

  // Define props and state
  const props = defineProps(['date', 'weekdays']);
  const today = new Date().toISOString().slice(0, 10);
  const weekdaysRef = ref();

  const onEnter = (indexDay, indexItem, checklist, e) => {
    const selectionStart = e.target.selectionStart;
    const currentText = checklist[indexItem].text;
    const before = currentText.slice(0, selectionStart);
    const after = currentText.slice(selectionStart);
    checklist[indexItem].text = before;
    checklist.splice(indexItem + 1, 0, { text: after, checked: false });
    focusItem(indexDay, indexItem + 1, 0, 0);
  };

  const onBackspace = (indexDay, indexItem, checklist, e) => {
    if (indexItem > 0 && e.target.selectionStart === 0) {
      e.preventDefault();
      const start = checklist[indexItem - 1].text.length;
      const end = checklist[indexItem - 1].text.length;
      checklist[indexItem - 1].text += e.target.value;
      checklist.splice(indexItem, 1);
      focusItem(indexDay, indexItem - 1, start, end);
    }
  };

  const onDelete = (indexDay, indexItem, checklist, e) => {
    if (indexItem < checklist.length - 1 && e.target.selectionStart === e.target.value.length) {
      e.preventDefault();
      const start = checklist[indexItem].text.length;
      const end = checklist[indexItem].text.length;
      checklist[indexItem].text += checklist[indexItem + 1].text;
      checklist.splice(indexItem + 1, 1);
      focusItem(indexDay, indexItem, start, end);
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

  onMounted(() => {
    const elem = weekdaysRef.value.querySelector(`.we-week__day.today`);
    elem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
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
            <input type="checkbox" :id="`check-${indexDay}-${indexItem}`" v-model="item.checked" />
            <label :for="`check-${indexDay}-${indexItem}`"></label>
          </div>
          <div class="we-week__day-checklist-item-text">
            <input
              :class="{ completed: item.checked }"
              :id="`text-${indexDay}-${indexItem}`"
              @keydown.arrow-down.prevent="focusItem(indexDay, indexItem + 1, $event.target.selectionStart, $event.target.selectionEnd)"
              @keydown.arrow-up.prevent="focusItem(indexDay, indexItem - 1, $event.target.selectionStart, $event.target.selectionEnd)"
              @keydown.backspace="onBackspace(indexDay, indexItem, weekday.checklist, $event)"
              @keydown.delete="onDelete(indexDay, indexItem, weekday.checklist, $event)"
              @keydown.enter="onEnter(indexDay, indexItem, weekday.checklist, $event)"
              type="text"
              v-model="item.text"
            />
            <label :for="`text-${indexDay}-${indexItem}`"></label>
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
              background-color: var(--color-background);
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