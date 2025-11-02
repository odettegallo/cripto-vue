<template>
  <div>
    <v-app-bar class="bg-black" elevation="2">
      <v-container>
        <div class="d-flex align-center w-100">

          <v-app-bar-nav-icon class="d-lg-none text-white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <RouterLink class="navbar-brand fw-bold text-white text-decoration-none d-flex align-center" to="/home">
            <v-icon class="me-2" color="white">mdi-currency-btc</v-icon>
            Crypto Portal
          </RouterLink>

          <div class="d-none d-lg-flex align-center ms-6" v-if="isAuthenticated">
              <RouterLink class="nav-link text-white text-decoration-none" to="/home">
                <v-icon class="me-1" color="white">mdi-home</v-icon>
                Inicio
              </RouterLink>
              <RouterLink v-if="isAdmin" class="nav-link text-white text-decoration-none ms-4" to="/admin">
                <v-icon class="me-1" color="white">mdi-cog</v-icon>
                Administración
              </RouterLink>
          </div>

          <v-spacer />

          <div class="d-flex align-center">
            <template v-if="isAuthenticated">
              <span class="navbar-text me-3 d-none d-md-inline text-white fw-bold">
                <v-icon color="white" size="18" class="me-1">mdi-account-circle</v-icon>
                {{ userEmail }}
              </span>
              <v-btn class="text-white" variant="outlined" size="small" @click="handleLogout" prepend-icon="mdi-logout">
                Cerrar Sesión
              </v-btn>
            </template>
            <template v-else>
               <v-btn class="text-white" variant="outlined" size="small" to="/login" prepend-icon="mdi-login">
                Ingresar
              </v-btn>
            </template>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list dense nav>
        <v-list-item class="bg-purple mb-3">
          <v-list-item-title class="fw-bold text-white">
            <v-icon class="me-2" color="white">mdi-currency-btc</v-icon> Crypto Portal
          </v-list-item-title>
        </v-list-item>
        
        <v-list-item prepend-icon="mdi-home" title="Inicio" to="/home" @click="drawer = false" />
        
        <v-list-item v-if="isAdmin" prepend-icon="mdi-cog" title="Administración" to="/admin" @click="drawer = false" />
        
        <v-list-item v-if="isAuthenticated" prepend-icon="mdi-logout" title="Cerrar Sesión" @click="handleLogout" />
        <v-list-item v-else prepend-icon="mdi-login" title="Ingresar" to="/login" @click="drawer = false" />
        
        <v-list-item v-if="isAuthenticated">
            <v-list-item-title class="text-muted text-caption mt-2">Usuario: {{ userEmail }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'NavBar',
  data: () => ({
    drawer: false,
  }),
  computed: {
    ...mapState(useAuthStore, {
      isAuthenticated: 'isLoggedIn',
      userEmail: 'currentUserEmail', 
      isAdmin: 'isAdmin'
    }),
    userName() {
      return this.userEmail ? this.userEmail.split('@')[0] : '';
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['logoutUser']),
    handleLogout() {
      this.drawer = false;
      this.logoutUser();
    }
  }
}
</script>

<style scoped>
/* 1. Barra de Aplicación: Estilo de Lujo Oscuro */
.app-bar-luxury {
  /* Fondo muy oscuro (background) */
  background-color: var(--v-theme-background) !important;
  /* Borde inferior sutil de neón/oro */
  border-bottom: 2px solid rgba(255, 215, 0, 0.2); 
  /* Sombra más dramática */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5) !important;
}

/* 2. Logo */
.navbar-brand {
  font-size: 1.6rem;
  letter-spacing: 1px;
  font-weight: 700 !important;
  /* Icono con animación de pulso */
}
.logo-icon {
    animation: pulseNeon 1.5s infinite alternate;
}

/* 3. Links de Navegación */
.nav-link {
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 8px 12px; 
  border-radius: 6px;
  color: #A0A0A0 !important; /* Color base gris sutil */
}
/* Efecto hover: Resplandor con color principal (Gold) */
.nav-link:hover {
  background: rgba(255, 215, 0, 0.1); 
  color: var(--v-theme-primary) !important;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.4);
}
/* Link Activo: Resaltado con color secundario (Neon) */
.nav-link.router-link-active {
    color: var(--v-theme-secondary) !important;
    border-bottom: 2px solid var(--v-theme-secondary);
}

/* 4. Botones */
/* Botón de Logout: Outline Neón */
.btn-neon-outline {
    color: var(--v-theme-secondary) !important;
    border-color: var(--v-theme-secondary) !important;
    transition: all 0.3s ease;
}
.btn-neon-outline:hover {
    background-color: rgba(0, 255, 255, 0.1) !important;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}
/* Botón de Login: Relleno Gold */
.btn-gold-flat {
    background-color: var(--v-theme-primary) !important;
    color: #000 !important; /* Texto negro para contraste en oro */
    font-weight: 700;
    transition: all 0.3s ease;
}
.btn-gold-flat:hover {
    background-color: #ffe033 !important; /* Dorado más claro */
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

/* 5. Drawer de Navegación */
.nav-drawer-dark {
    background-color: var(--v-theme-surface) !important; /* Color de superficie oscuro */
}

/* Keyframe para el logo */
@keyframes pulseNeon {
  0% { transform: scale(1); filter: drop-shadow(0 0 1px var(--v-theme-secondary)); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 8px var(--v-theme-secondary)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 1px var(--v-theme-secondary)); }
}
</style>