<script setup>
  import { ref, watch } from 'vue';
  import WeButton from './WeButton.vue';
  import WeProgressBar from './WeProgressBar.vue';
  
  // Initialize props
  const props = defineProps(['storage', 'today', 'update', 'visibility']);

  // Initialize states
  const storageKeys = ref([]);
  const delay = ref(1000);
  const timeoutId = ref(null);
  const oldStorageKeys = ref([]);
  const oldStorageKeysRemoved = ref(0);

  // Remove old checklist by holding down for a specific amount of time
  const removeOldChecklists = start => {
    if (start === true) {
      timeoutId.value = setTimeout(() => {
        // Update button text
        oldStorageKeysRemoved.value = oldStorageKeys.value.length;

        // Remove old storage keys
        props.storage.remove(JSON.parse(JSON.stringify(oldStorageKeys.value)));
        props.update();
        updateStorageKeys();

        // Reset timeout state
        timeoutId.value = null;
      }, delay.value);
    }
    else {
      // Cancel removing checklists
      if (timeoutId.value !== null) {
        clearTimeout(timeoutId.value);
        timeoutId.value = null;
      }
    }
  }

  // Update item quota
  const updateStorageKeys = async () => {
    props.storage.getKeys().then(result => {
      // Update storage keys from results
      storageKeys.value = result;

      // Get array of old storage keys
      const todayInt = Number(props.today.replaceAll('-', ''));
      oldStorageKeys.value = storageKeys.value.filter(key => {
        const dateInt = Number(key.replaceAll('-', ''));
        return dateInt > 0 && dateInt < todayInt;
      });
    });
  }

  // Update settings from parent visibility prop
  watch(() => props.visibility, isVisible => {
    if (isVisible === true) {
      updateStorageKeys();
    }
    else {
      oldStorageKeysRemoved.value = 0;
    }
  });
</script>

<template>
  <div class="we-settings">
    <div class="label">Data</div>
    <p>The <a href="https://developer.chrome.com/docs/extensions/reference/api/storage#properties_4" target="_blank">Chrome Storage API</a> allows up to 512 checklists.</p>
    <WeProgressBar
      :total="512"
      :value="storageKeys.length"
    />
    <p>Need more checklists? Hold the following button for <strong>one second</strong> to remove all checklists before today's date.</p>
    <WeButton
      :class="{ holding: timeoutId != null }"
      :style="{ '--delay-remove': delay + 'ms' }"
      :disabled="oldStorageKeysRemoved > 0"
      @pointerdown="removeOldChecklists(true)"
      @pointerup="removeOldChecklists(false)"
    >
      <span v-if="oldStorageKeysRemoved === 0">Remove <strong>{{ oldStorageKeys.length }}</strong> old checklists</span>
      <span v-else><strong>{{ oldStorageKeysRemoved }}</strong> checklists removed</span>
    </WeButton>
  </div>
</template>

<style lang="scss" scoped>
  .we-settings {
    label, .label {
      font-size: var(--size-14);
      font-weight: bold;
    }

    .we-button {
      &.holding {
        position: relative;

        &:before {
          animation-fill-mode: forwards;
          animation: load var(--delay-remove) linear;
          background-color: var(--color-primary);
          content: '';
          display: block;
          height: var(--size-4);
          left: 0;
          position: absolute;
          top: 0;
          width: 0%;
        }

        @keyframes load {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      }
    }

    p {
      margin: var(--size-8) 0;
      font-size: var(--size-14);

      a {
        color: var(--color-link);
      }
    }
  }
</style>