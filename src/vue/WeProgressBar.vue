<script setup>
  import { computed } from 'vue';
  import { useFormat } from '../js/utils/use-format.js';

  const { formatNumber } = useFormat();
  const props = defineProps(['total', 'value']);
  const fraction = computed(() => `${ formatNumber(props.value) } / ${ formatNumber(props.total) }`);
  const decimal = computed(() => props.value / props.total);
  const text = computed(() => `${ fraction.value } (${ formatNumber(decimal.value * 100, 1) }%)`);
</script>

<template>
  <div
    class="progress-bar"
  >
    <div class="progress-bar__progress">
      <div class="progress-bar__progress-amount" :style="{ width: (decimal * 100) + '%' }"></div>
    </div>
    <div class="progress-bar__text">
      {{ text }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .progress-bar {
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    font-family: inherit;
    font-size: var(--size-24);
    gap: var(--size-4);
    justify-content: center;
    position: relative;
    transition: background-color 0.1s ease-in-out, border 0.1s ease-in-out, transform 0.1s ease-in-out;
    width: 100%;
    -webkit-tap-highlight-color: transparent;

    &:focus {
      outline: none;
    }

    .progress-bar__progress {
      border: var(--size-1) solid var(--color-primary);
      border-radius: var(--size-8);
      height: var(--size-8);
      width: 100%;
      position: relative;
      
      .progress-bar__progress-amount {
        background-color: var(--color-primary);
        border-radius: var(--size-4);
        height: 100%;
        left: 0;
        max-width: 100%;
        min-width: var(--size-8);
        position: absolute;
        top: 0;
        transition: width 100ms linear;
      }
    }

    .progress-bar__text {
      font-size: var(--size-14);
      font-weight: bold;
      position: relative;
    }
  }
</style>