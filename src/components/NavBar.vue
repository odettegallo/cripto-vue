<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      location="left"
      color="surface"
    >
      <v-list nav>
        <v-list-item v-if="!authStore.isAdmin" :to="{ name: 'Home' }" prepend-icon="mdi-home" title="Inicio"></v-list-item>
        <v-list-item v-if="!authStore.isAdmin" :to="{ name: 'Enlaces' }" prepend-icon="mdi-link" title="Cripto Enlaces"></v-list-item>
        <v-list-item v-if="!authStore.isAdmin" :to="{ name: 'Carrito' }" prepend-icon="mdi-cart" title="Carrito"></v-list-item>
        <v-list-item v-if="authStore.isAdmin" :to="{ name: 'Admin' }" prepend-icon="mdi-security" title="Admin" class="text-secondary"></v-list-item>
        
        <v-divider></v-divider>
        
        <v-list-item @click="authStore.logoutUser" prepend-icon="mdi-logout" title="Cerrar Sesión" class="text-error"></v-list-item>
      </v-list>
      
      <template v-slot:append>
        <div class="pa-2 d-flex justify-center">
          <v-btn icon :to="{ name: 'Carrito' }" class="mx-1" variant="flat">
            <v-badge 
              :content="cartStore.cartCount" 
              :value="cartStore.cartCount" 
              color="primary" 
              overlap
            >
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </v-btn>
        </div>
      </template>

    </v-navigation-drawer>

    <v-app-bar 
      app 
      dark 
      color="surface" 
      elevation="4"
      class="px-lg-12"
    >
      <v-app-bar-nav-icon class="d-md-none" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <RouterLink class="navbar-brand fw-bold text-white text-decoration-none d-flex align-center" to="/home">
              <v-icon class="me-2" color="white">mdi-currency-btc</v-icon>
              Crypto Portal
            </RouterLink>

      <v-spacer></v-spacer>

      <div class="d-none d-md-flex align-center">
        <v-btn 
          v-if="!authStore.isAdmin" 
          text 
          :to="{ name: 'Home' }" 
          class="text-caption mx-1"
        >
          <v-icon left>mdi-home</v-icon>
          Inicio
        </v-btn>
        
        <v-btn 
          v-if="!authStore.isAdmin" 
          text 
          :to="{ name: 'Enlaces' }" 
          class="text-caption mx-1"
        >
          <v-icon left>mdi-link</v-icon>
          Cripto Enlaces
        </v-btn>
        
        <v-btn 
          v-if="authStore.isAdmin" 
          text 
          :to="{ name: 'Admin' }" 
          class="text-caption mx-1"
          color="secondary"
        >
          <v-icon left>mdi-security</v-icon>
          Admin
        </v-btn>
        
        <v-btn 
          icon 
          :to="{ name: 'Carrito' }" 
          class="mx-1"
        >
          <v-badge 
            :content="cartStore.cartCount" 
            :value="cartStore.cartCount" 
            color="primary" 
            overlap
          >
            <v-icon>mdi-cart</v-icon>
          </v-badge>
        </v-btn>

        <v-btn 
          icon 
          @click="authStore.logoutUser" 
          class="ml-2"
          color="error"
          title="Cerrar Sesión"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
      
    </v-app-bar>

    <v-snackbar 
      v-model="showNotification"
      :timeout="3000"
      color="primary"
      elevation="24"
      top
    >
      <span class="fw-bold">{{ cartStore.notification }}</span>
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="cartStore.setNotification(null)"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'; // Importar 'ref'
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

// 1. Estado para el Navigation Drawer
const drawer = ref(false); // Nuevo estado

// 2. Inicializar Stores
const authStore = useAuthStore();
const cartStore = useCartStore();

// 3. Controlar la visibilidad de la notificación
const showNotification = computed({
  get: () => !!cartStore.notification,
  set: (val) => {
    if (!val) {
      cartStore.setNotification(null);
    }
  }
});
</script>

<style scoped>
/* Estilos existentes */
.text-gradient {
  background: linear-gradient(135deg, #FFD700 0%, #00FFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.fw-bold { font-weight: bold; }
</style>