<template>
  <div>
    <v-app-bar class="bg-purple" elevation="2">
      <v-container>
        <div class="d-flex align-center w-100">

          <v-app-bar-nav-icon class="d-lg-none text-white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <RouterLink class="navbar-brand fw-bold text-white text-decoration-none d-flex align-center" to="/">
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
.bg-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
.text-purple {
  color: #764ba2 !important;
}
.navbar-brand {
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}
.nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 8px 12px; 
  border-radius: 8px;
}
.nav-link:hover {
  background: rgba(255, 255, 255, 0.15); 
}
</style>