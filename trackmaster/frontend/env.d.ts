/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Wails runtime types (for when integrating with Wails)
declare global {
  interface Window {
    backend?: {
      Track?: (trackingNumbers: string[]) => Promise<any>
      UpdateSettings?: (settings: any) => Promise<any>
      ExportData?: (format: 'csv' | 'json') => Promise<any>
    }
  }
} 
