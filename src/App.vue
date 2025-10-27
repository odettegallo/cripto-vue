<template>
  <v-app>
    <NavBar v-if="showNavBar" />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'App',
  components: {
    NavBar
  },
  computed: {
    showNavBar() {
      const hiddenRoutes = ['/login', '/registro']
      return !hiddenRoutes.includes(this.$route.path)
    }
  },
  created() {
    const authStore = useAuthStore();
    authStore.subscribeToAuthState();
  }
}
</script>

<style>
/* App.vue: dentro de <style> */

/* UTILIDADES Y HELPERS DE COLOR */
/* Gradiente Dorado/Neón para "Lujo/Tecnología" */
.text-gradient {
  background: linear-gradient(135deg, #FFD700 0%, #00FFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* SCROLLBAR PERSONALIZADO: Ajustado a tonos oscuros/neón */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1e1e1e; /* Fondo de track oscuro */
}

::-webkit-scrollbar-thumb {
  background: #FFD700; /* Pulgar dorado */
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00FFFF; /* Hover neón */
}

/* ANIMACIONES GLOBALES (Se mantienen, pero considera usar transiciones de Vuetify) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

/* ... (resto de .fade- y .slide- se mantienen) ... */


/* Spinner (Ajustado a la nueva paleta) */
.spinner-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #333; /* Color de fondo del borde oscuro */
  border-top: 2px solid #FFD700; /* Color principal: Dorado */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Blur para modal (Se mantiene, si es necesario) */
body.modal-open main {
  filter: blur(3px);
}

.modal-backdrop.show {
  opacity: 0.8; /* Aumentamos opacidad en tema oscuro */
  background-color: #0A0A0A; /* Fondo muy oscuro */
}
</style>