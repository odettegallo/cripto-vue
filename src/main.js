// main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({
  icons: { defaultSet: 'mdi' },
  theme: {
    defaultTheme: 'adwebTheme',
    themes: {
      adwebTheme: {
        dark: true, // ¡Importante! Cambiamos a tema oscuro para el lujo
        colors: {
          // Fondo oscuro/lujo (Surface se usa a menudo para el fondo principal de componentes)
          surface: '#121212', 
          // Color principal: Dorado/Ámbar de lujo y dinero
          primary: '#FFD700', // Gold
          // Color secundario: Azul eléctrico/Neón para tecnología
          secondary: '#00FFFF', // Cyan/Aqua
          // Color de fondo general de la app, más oscuro que surface
          background: '#0A0A0A',
          // Color para el texto en fondos oscuros
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