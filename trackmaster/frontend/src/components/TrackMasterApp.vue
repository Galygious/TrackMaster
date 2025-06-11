<template>
  <div class="flex flex-col h-screen bg-slate-900 text-slate-50">
    <!-- Header -->
    <header class="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div class="flex items-center gap-2">
        <PackageSearchIcon class="h-7 w-7 text-sky-500" />
        <h1 class="text-xl font-semibold text-slate-100">TrackMaster</h1>
      </div>
      <button
        @click="isSettingsOpen = true"
        class="text-slate-400 hover:text-sky-400 hover:bg-slate-700 p-2 rounded-md transition-colors"
        title="Settings"
      >
        <SettingsIcon class="h-5 w-5" />
      </button>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
      <!-- Input Section -->
      <div class="lg:w-1/3 xl:w-1/4 bg-slate-800 border border-slate-700 shadow-xl flex flex-col rounded-lg">
        <div class="p-6 pb-2">
          <h2 class="text-slate-100 text-lg font-semibold">Add Tracking Numbers</h2>
        </div>
        <div class="flex-1 flex flex-col gap-4 p-6 pt-2">
          <textarea
            v-model="trackingNumbersInput"
            placeholder="Enter tracking numbers, one per line..."
            class="flex-1 min-h-[150px] bg-slate-900 border border-slate-600 text-slate-200 focus:border-sky-500 rounded-md p-3 resize-y focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            rows="8"
          />
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              @click="handleImportCSV"
              class="flex-1 border border-slate-600 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <UploadCloudIcon class="h-4 w-4" /> Import CSV
            </button>
            <input
              ref="fileInputRef"
              type="file"
              @change="handleFileChange"
              accept=".csv"
              class="hidden"
            />
            <button
              @click="handleTrackAll"
              :disabled="isLoading"
              class="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlayIcon class="h-4 w-4" /> {{ isLoading ? 'Tracking...' : 'Track All' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Results Table Section -->
      <div class="flex-1 bg-slate-800 border border-slate-700 shadow-xl flex flex-col overflow-hidden rounded-lg">
        <div class="p-6 pb-2">
          <h2 class="text-slate-100 text-lg font-semibold">Tracking Results</h2>
        </div>
        <div class="flex-1 overflow-y-auto p-0">
          <div v-if="packages.length === 0" class="flex flex-col items-center justify-center h-full text-slate-500 p-6">
            <PackageSearchIcon class="h-16 w-16 mb-4" />
            <p class="text-lg">No packages tracked yet.</p>
            <p class="text-sm">Enter tracking numbers or import a CSV to get started.</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="sticky top-0 bg-slate-800 z-[1]">
                <tr class="border-b border-slate-700">
                  <th class="text-slate-300 text-left p-3 w-[180px]">Tracking Number</th>
                  <th class="text-slate-300 text-left p-3 w-[150px]">Carrier</th>
                  <th class="text-slate-300 text-left p-3 w-[180px]">Status</th>
                  <th class="text-slate-300 text-left p-3">Location</th>
                  <th class="text-slate-300 text-right p-3 w-[180px]">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="pkg in packages"
                  :key="pkg.id"
                  :class="[
                    'border-b border-slate-700 transition-colors',
                    getStatusStyles(pkg.status).row
                  ]"
                >
                  <td class="font-medium text-slate-200 p-3">{{ pkg.trackingNumber }}</td>
                  <td class="text-slate-300 p-3">
                    <div class="flex items-center gap-2">
                      <img
                        v-if="pkg.carrierLogo"
                        :src="pkg.carrierLogo"
                        :alt="pkg.carrier"
                        class="h-4 object-contain"
                      />
                      <span>{{ pkg.carrier }}</span>
                    </div>
                  </td>
                  <td :class="['p-3', getStatusStyles(pkg.status).text]">
                    <div class="flex items-center gap-2">
                      <component :is="getStatusStyles(pkg.status).icon" class="h-4 w-4" />
                      <span>{{ pkg.status }}</span>
                    </div>
                  </td>
                  <td class="text-slate-300 p-3 truncate max-w-xs">{{ pkg.location }}</td>
                  <td class="text-slate-400 text-right p-3">{{ formatLastUpdated(pkg.lastUpdated) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Settings Sheet -->
    <SettingsSheet
      v-model:open="isSettingsOpen"
      :settings="settings"
      @settings-change="handleSettingsChange"
    />

    <!-- Toast Container -->
    <div id="toast-container" class="fixed top-4 right-4 z-50 space-y-2"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import SettingsSheet from './SettingsSheet.vue'
import {
  PackageSearchIcon,
  UploadCloudIcon,
  PlayIcon,
  SettingsIcon,
  InfoIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  TruckIcon,
  ClockIcon
} from './icons/index'

type PackageStatus = 'Pending' | 'Info' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception' | 'Error'

interface PackageInfo {
  id: string
  trackingNumber: string
  carrier?: string
  carrierLogo?: string
  status: PackageStatus
  location?: string
  lastUpdated?: string
}

interface Settings {
  headlessMode: boolean
  outputFormat: 'csv' | 'json'
}

// Reactive state
const trackingNumbersInput = ref<string>('')
const packages = ref<PackageInfo[]>([])
const isLoading = ref<boolean>(false)
const isSettingsOpen = ref<boolean>(false)
const settings = reactive<Settings>({
  headlessMode: true,
  outputFormat: 'csv'
})

// Template refs
const fileInputRef = ref<HTMLInputElement>()

// Carrier detection and logos
const carrierLogos: Record<string, string> = {
  UPS: '/generic-delivery-logo.png',
  USPS: '/generic-postal-logo.png',
  FedEx: '/fedex-logo.png',
  DHL: '/dhl-logo.png'
}

const detectCarrier = (trackingNumber: string): string => {
  if (/^(1Z|9\d{16})/i.test(trackingNumber)) return 'UPS'
  if (/^(\d{20,22}|9\d{21})$/.test(trackingNumber)) return 'USPS'
  if (/^(\d{12}|\d{15})$/.test(trackingNumber)) return 'FedEx'
  if (/^\d{10}$/.test(trackingNumber)) return 'DHL'
  return 'Unknown'
}

// Status styling function
const getStatusStyles = (status: PackageStatus) => {
  switch (status) {
    case 'Delivered':
      return {
        dot: 'bg-green-500',
        text: 'text-green-400',
        row: 'bg-green-500/10 hover:bg-green-500/20',
        icon: CheckCircle2Icon
      }
    case 'In Transit':
      return {
        dot: 'bg-yellow-500',
        text: 'text-yellow-400',
        row: 'bg-yellow-500/10 hover:bg-yellow-500/20',
        icon: TruckIcon
      }
    case 'Out for Delivery':
      return {
        dot: 'bg-sky-500',
        text: 'text-sky-400',
        row: 'bg-sky-500/10 hover:bg-sky-500/20',
        icon: TruckIcon
      }
    case 'Exception':
      return {
        dot: 'bg-red-500',
        text: 'text-red-400',
        row: 'bg-red-500/10 hover:bg-red-500/20',
        icon: AlertTriangleIcon
      }
    case 'Error':
      return {
        dot: 'bg-red-700',
        text: 'text-red-500',
        row: 'bg-red-700/10 hover:bg-red-700/20',
        icon: AlertTriangleIcon
      }
    case 'Info':
      return {
        dot: 'bg-blue-500',
        text: 'text-blue-400',
        row: 'bg-blue-500/10 hover:bg-blue-500/20',
        icon: InfoIcon
      }
    default: // Pending
      return {
        dot: 'bg-slate-500',
        text: 'text-slate-400',
        row: 'bg-slate-700/20 hover:bg-slate-700/30',
        icon: ClockIcon
      }
  }
}

// Utility functions
const formatLastUpdated = (dateString?: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleString()
  } catch (e) {
    return 'Invalid Date'
  }
}

const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', description?: string) => {
  // Simple toast implementation - you can replace with a proper toast library
  console.log(`${type.toUpperCase()}: ${message}${description ? ` - ${description}` : ''}`)
  
  // For now, we'll use browser alerts as placeholders
  if (type === 'error') {
    alert(`Error: ${message}`)
  } else if (type === 'success') {
    console.log(`✅ ${message}`)
  }
}

// Event handlers
const handleImportCSV = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const numbersFromFile = content
        .split(/[\n,]+/)
        .map((num) => num.trim())
        .filter(Boolean)
      trackingNumbersInput.value += (trackingNumbersInput.value ? '\n' : '') + numbersFromFile.join('\n')
      showToast(`${numbersFromFile.length} tracking numbers imported from ${file.name}`, 'success')
    }
    reader.onerror = () => {
      showToast('Failed to read the CSV file.', 'error')
    }
    reader.readAsText(file)
    target.value = '' // Reset file input
  }
}

const handleTrackAll = async () => {
  const numbersToTrack = trackingNumbersInput.value
    .split('\n')
    .map((num) => num.trim())
    .filter(Boolean)
  
  if (numbersToTrack.length === 0) {
    showToast('Please enter or import tracking numbers.', 'warning')
    return
  }

  isLoading.value = true
  showToast(`Tracking ${numbersToTrack.length} package(s)...`, 'info', 'This may take a few moments.')

  // Simulate API call - replace with actual backend call: window.backend.Track(...)
  const newPackagesData: PackageInfo[] = numbersToTrack.map((tn) => ({
    id: `${tn}-${Date.now()}`,
    trackingNumber: tn,
    carrier: detectCarrier(tn),
    carrierLogo: carrierLogos[detectCarrier(tn)] || '/unknown-carrier-logo.png',
    status: 'Pending' as PackageStatus,
    location: 'Fetching...',
    lastUpdated: new Date().toISOString()
  }))
  
  packages.value = newPackagesData

  // Simulate fetching data for each package
  for (let i = 0; i < newPackagesData.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))
    
    const pkg = packages.value.find(p => p.id === newPackagesData[i].id)
    if (pkg) {
      const randomStatuses: PackageStatus[] = ['In Transit', 'Delivered', 'Exception', 'Out for Delivery', 'Info']
      const status = randomStatuses[Math.floor(Math.random() * randomStatuses.length)]
      pkg.status = status
      pkg.location = status === 'Delivered' ? 'Front Door, Anytown, USA' : 'In Transit Hub, Somewhere, USA'
      pkg.lastUpdated = new Date().toISOString()
    }
  }

  isLoading.value = false
  showToast('Tracking complete!', 'success', `${numbersToTrack.length} packages updated.`)
}

const handleSettingsChange = (newSettings: Settings) => {
  Object.assign(settings, newSettings)
  showToast('Settings saved!', 'success')
  console.log('New settings:', newSettings)
  // Here you would call: window.backend.UpdateSettings(newSettings)
}
</script>

<style scoped>
/* Component-specific styles if needed */
</style> 
