import { createApp } from 'vue'
import App from './App.vue'
import './styles/globals.css'
import Toast from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Create and mount the Vue app
const app = createApp(App)

app.use(Toast, {
  // You can customize options here if needed
  position: 'top-right',
  timeout: 3500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
} as PluginOptions)

app.mount('#app') 
