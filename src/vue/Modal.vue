<script setup>
  import WeButton from './WeButton.vue';

  const props = defineProps({
    actions: {
      type: Array,
      default: () => ([])
    },
    image: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  });

  const selectLastAction = () => {
    if (props.actions.length > 0) {
      const lastAction = props.actions[props.actions.length - 1];
      if (lastAction && typeof lastAction.callback === 'function') {
        lastAction.callback();
      }
    }
  }
</script>

<template>
  <div class="modal">
    <div class="modal__overlay" @click="selectLastAction"></div>
    <div class="modal__container">
      <div class="modal__container-content">
        <h2 class="modal__container-content-title" v-if="title">{{ title }}</h2>
        <img class="modal__container-content-image" :src="image" v-if="image" />
        <p class="modal__container-content-text" v-if="text">{{ text }}</p>
        <slot></slot>
      </div>
      <div class="modal__container-actions">
        <WeButton
          v-for="(action, index) in actions"
          :key="index"
          :class="{ selected: index === Object.keys(actions).length - 1 }, [ action.animation ]"
          class="modal__container-actions-action grow"
          @click="action.callback"
        >
          <span class="modal__container-actions-action-icon material-symbols-rounded" v-if="action.icon">{{ action.icon }}</span>
          <span class="modal__container-actions-action-label">{{ action.label }}</span>
        </WeButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .modal {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    padding: 1rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;

    .modal__overlay {
      background-color: var(--color-background-transparent);
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 1;
    }

    .modal__container {
      background-color: var(--color-background);
      border: var(--size-1) solid var(--color-primary);
      border-radius: var(--size-4);
      max-width: 100%;
      position: relative;
      width: 28rem;
      z-index: 2;
      
      .modal__container-content {
        background-color: var(--color-1);
        border-left: 0.125rem solid var(--color-4);
        border-top: 0.125rem solid var(--color-4);
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        border-right: 0.125rem solid var(--color-4);
        color: var(--color-10);
        display: flex;
        flex-direction: column;
        gap: var(--size-8);
        padding: 1rem;

        .modal__container-content-title {
          margin: 0;
          font-size: var(--size-18);
          font-weight: bold;
        }
  
        .modal__container-content-text {
          margin: 0;
          font-size: 1.5rem;
        }

        .modal__container-content-image {
          height: auto;
          width: 100%;
        }
      }
      
      .modal__container-actions {
        background-color: var(--color-background);
        border-top: var(--size-1) solid var(--color-border);
        border-bottom-left-radius: var(--size-4);
        border-bottom-right-radius: var(--size-4);
        display: flex;
        gap: var(--size-8);
        justify-content: flex-end;
        padding: 1rem;
        width: 100%;
      }
    }
  }
</style>