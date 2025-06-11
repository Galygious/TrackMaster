import { defineComponent, h } from 'vue'

// Base icon component
const createIcon = (name: string, path: string | string[]) => {
  return defineComponent({
    name,
    props: {
      class: {
        type: String,
        default: 'h-4 w-4'
      }
    },
    setup(props) {
      return () => h('svg', {
        class: props.class,
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        viewBox: '0 0 24 24'
      }, Array.isArray(path) ? path.map(p => h('path', { d: p })) : [h('path', { d: path })])
    }
  })
}

// Icon exports
export const PackageSearchIcon = createIcon('PackageSearch', [
  'M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14',
  'm7.5 4.27 9 5.15',
  'M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  'm21 21-1.5-1.5'
])

export const UploadCloudIcon = createIcon('UploadCloud', [
  'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
  'M12 12v9',
  'm16 16-4-4-4 4'
])

export const PlayIcon = createIcon('Play', 'M6 4v16l12-8z')

export const SettingsIcon = createIcon('Settings', [
  'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
])

export const InfoIcon = createIcon('Info', [
  'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z',
  'M12 9v4',
  'M12 17h.01'
])

export const AlertTriangleIcon = createIcon('AlertTriangle', [
  'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  'M12 9v4',
  'M12 17h.01'
])

export const CheckCircle2Icon = createIcon('CheckCircle2', [
  'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z',
  'm9 12 2 2 4-4'
])

export const TruckIcon = createIcon('Truck', [
  'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2',
  'M15 18H9',
  'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14',
  'M11 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  'M20 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z'
])

export const ClockIcon = createIcon('Clock', [
  'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z',
  'M12 6v6l4 2'
]) 