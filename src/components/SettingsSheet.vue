<template>
  <div v-if="open" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      @click="$emit('update:open', false)"
    ></div>

    <!-- Sheet -->
    <div class="fixed right-0 top-0 h-full w-full max-w-md transform transition-transform duration-300 ease-in-out">
      <div class="flex h-full flex-col bg-slate-900 border-l border-slate-700 text-slate-50 shadow-xl">
        <!-- Header -->
        <div class="p-6 border-b border-slate-700">
          <h2 class="text-lg font-semibold text-slate-50">Settings</h2>
          <p class="text-sm text-slate-400 mt-1">Configure application preferences.</p>
        </div>

        <!-- Content -->
        <div class="flex-1 p-6 space-y-6">
          <!-- Headless Mode -->
          <div class="flex items-center justify-between space-x-2 p-4 rounded-md bg-slate-800 border border-slate-700">
            <label class="flex flex-col space-y-1 cursor-pointer flex-1">
              <span class="text-slate-200">Headless Mode</span>
              <span class="font-normal leading-snug text-slate-400 text-sm">
                Run scraping operations without showing browser windows.
              </span>
            </label>
            <button
              @click="toggleHeadlessMode"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900',
                currentSettings.headlessMode ? 'bg-sky-500' : 'bg-slate-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
                  currentSettings.headlessMode ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>

          <!-- Output Format -->
          <div class="space-y-3 p-4 rounded-md bg-slate-800 border border-slate-700">
            <label class="text-slate-200 font-medium">Output Format</label>
            <div class="flex space-x-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="csv"
                  v-model="currentSettings.outputFormat"
                  class="h-4 w-4 text-sky-500 border-slate-600 focus:ring-sky-500 focus:ring-offset-slate-900 bg-slate-700"
                />
                <span class="text-slate-300">CSV</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="json"
                  v-model="currentSettings.outputFormat"
                  class="h-4 w-4 text-sky-500 border-slate-600 focus:ring-sky-500 focus:ring-offset-slate-900 bg-slate-700"
                />
                <span class="text-slate-300">JSON</span>
              </label>
            </div>
            <p class="text-sm text-slate-400">Choose the default format for exporting tracking data.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-slate-700 flex gap-3">
          <button
            @click="$emit('update:open', false)"
            class="flex-1 border border-slate-600 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Settings {
  headlessMode: boolean
  outputFormat: 'csv' | 'json'
}

interface Props {
  open: boolean
  settings: Settings
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'settings-change', settings: Settings): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state for settings
const currentSettings = ref<Settings>({
  headlessMode: props.settings.headlessMode,
  outputFormat: props.settings.outputFormat
})

// Watch for external settings changes
watch(() => props.settings, (newSettings) => {
  currentSettings.value = { ...newSettings }
}, { deep: true })

const toggleHeadlessMode = () => {
  currentSettings.value.headlessMode = !currentSettings.value.headlessMode
}

const handleSave = () => {
  emit('settings-change', { ...currentSettings.value })
  emit('update:open', false)
}
</script>

<style scoped>
/* Custom radio button styles */
input[type="radio"] {
  appearance: none;
  background-color: theme('colors.slate.700');
  border: 1px solid theme('colors.slate.600');
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  position: relative;
}

input[type="radio"]:checked {
  background-color: theme('colors.sky.500');
  border-color: theme('colors.sky.500');
}

input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.375rem;
  height: 0.375rem;
  background-color: white;
  border-radius: 50%;
}

input[type="radio"]:focus {
  outline: none;
  ring: 2px;
  ring-color: theme('colors.sky.500');
  ring-offset: 2px;
  ring-offset-color: theme('colors.slate.900');
}
</style> 