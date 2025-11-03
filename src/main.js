// main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const vuetify = createVuetify({
  components,
  directives,
  icons: { defaultSet: 'mdi' },
  theme: {
    defaultTheme: 'criptoTheme',
    themes: {
      criptoTheme: {
        dark: true, // ¡Importante! Cambiamos a tema oscuro para el lujo
        colors: {
          surface: '#121212', 
          primary: '#FFD700', 
          secondary: '#00FFFF', 
          background: '#0A0A0A',
          'on-surface': '#F0F0F0',
        }
      }
    }
  }
})

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')