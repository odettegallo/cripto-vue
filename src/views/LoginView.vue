<template>
  <div class="login-container">
    <v-container fluid class="h-100">
      <v-row class="h-100">
        <v-col cols="12" lg="6" class="d-flex align-center justify-center">
          <div class="login-form-container">
            <div class="text-center mb-4">
              <div class="logo-container mb-3">
                <v-icon color="secondary" size="48">mdi-key-chain</v-icon>
              </div>
              <h2 class="fw-bold mb-2 text-primary text-uppercase">Acceso al Panel</h2>
              <p class="text-medium-emphasis">Ingresa tus credenciales seguras</p>
          
            </div>

            <v-form @submit.prevent="handleLogin" class="login-form">
              <v-text-field
                v-model="formData.email"
                label="Billetera (Correo Electrónico)"
                type="email"
                :error="!!errors.email"
                :error-messages="errors.email ? [errors.email] : []"
                prepend-inner-icon="mdi-email-outline"
                density="comfortable"
                required
              />

              <v-text-field
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                label="Clave de Seguridad"
                :error="!!errors.password"
                :error-messages="errors.password ? [errors.password] : []"
                prepend-inner-icon="mdi-shield-lock-outline"
                append-inner-icon="mdi-eye"
                @click:append-inner="togglePassword"
                density="comfortable"
                required
              />

              <v-checkbox
                v-model="formData.rememberMe"
                label="Mantener sesión activa (Token)"
                color="secondary"
                class="mb-4"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                class="w-100 mb-3 btn-neon"
                :loading="isLoading"
                prepend-icon="mdi-rocket-launch-outline"
              >
                {{ isLoading ? 'Conectando...' : 'Iniciar Sesión' }}
              </v-btn>

              <v-alert v-if="generalError" type="error" variant="tonal" class="mb-3">
                {{ generalError }}
              </v-alert>

              <div class="text-center">
                <p class="mb-0">
                  ¿No tienes una cuenta?
                  <RouterLink to="/registro" class="text-secondary text-decoration-none fw-semibold">
                    Crea tu Billetera
                  </RouterLink>
                </p>
              </div>
            </v-form>
          </div>
        </v-col>

        <v-col cols="12" lg="6" class="d-none d-lg-flex align-center justify-center bg-dark-panel">
          <div class="text-center text-white">
            <div class="illustration-container mb-4">
              <v-icon color="secondary" size="128" style="opacity: 0.8;">mdi-bitcoin</v-icon>
            </div>
            <h3 class="fw-bold mb-3 text-gradient">Tu Gateway de Lujo a Web3</h3>
            <p class="fs-5 mb-4 text-medium-emphasis">
              Gestión de Activos Digitales de Próxima Generación.
            </p>
            <div class="features-list">
              <div class="feature-item mb-2">
                <v-icon color="primary" class="me-2">mdi-check-decagram</v-icon>
                <span class="text-medium-emphasis">Auditoría de Seguridad Nivel-A</span>
              </div>
              <div class="feature-item mb-2">
                <v-icon color="primary" class="me-2">mdi-check-decagram</v-icon>
                <span class="text-medium-emphasis">Transacciones Instantáneas (L2)</span>
              </div>
              <div class="feature-item">
                <v-icon color="primary" class="me-2">mdi-check-decagram</v-icon>
                <span class="text-medium-emphasis">Soporte Multilingüe VIP 24/7</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// ... (mismo script)
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'LoginView',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        rememberMe: false
      },
      errors: {},
      generalError: '',
      isLoading: false,
      showPassword: false
    }
  },
  methods: {
    validateForm() {
      // ... (misma lógica de validación)
      this.errors = {}
      
      // Email validation
      if (!this.formData.email) {
        this.errors.email = 'El correo electrónico es requerido'
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = 'Ingresa un correo electrónico válido'
      }
      
      // Password validation
      if (!this.formData.password) {
        this.errors.password = 'La contraseña es requerida'
      } else if (this.formData.password.length < 6) {
        this.errors.password = 'La contraseña debe tener al menos 6 caracteres'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    async handleLogin() {
      this.generalError = ''
      
      if (!this.validateForm()) {
        return
      }
      
      this.isLoading = true
      
      try {
        const authStore = useAuthStore()
        await authStore.loginUser(this.formData.email, this.formData.password)
        
        // Redirigir según el rol del usuario
        if (authStore.isAdmin) {
          this.$router.push('/admin')
        } else {
          this.$router.push('/home')
        }
        
      } catch (error) {
        console.error('Login error:', error)
        this.generalError = 'Error al iniciar sesión. Verifica tus credenciales.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* Contenedor principal: Fondo muy oscuro/negro */
.login-container {
  min-height: 100vh;
  /* Usamos el color de fondo definido en main.js */
  background: var(--v-theme-background, #0A0A0A); 
  height: 100vh;
  display: flex;
  align-items: center;
}

/* Contenedor del formulario: Tarjeta oscura y elegante */
.login-form-container {
  /* Usamos el color surface oscuro definido en main.js */
  background: var(--v-theme-surface, #121212);
  padding: 3rem;
  border-radius: 12px;
  /* Sombra sutil neón/dorada */
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.05), 0 0 20px rgba(0, 255, 255, 0.05); 
  width: 100%;
  max-width: 450px;
  /* Borde sutil */
  border: 1px solid rgba(255, 215, 0, 0.1); 
}

/* Panel lateral (d-none d-lg-flex) */
.bg-dark-panel {
  /* Fondo aún más oscuro o degradado sutil */
  background: #0D0D0D; 
  /* Agregamos un patrón de malla tecnológica */
  background-image: radial-gradient(#1e1e1e 1px, transparent 0);
  background-size: 40px 40px;
}

/* Animaciones/Íconos */
.logo-container {
  animation: pulseNeon 1.5s infinite alternate;
}

/* Botón con efecto neón/lujo */
.btn-neon {
  /* No se necesita definir background aquí, Vuetify lo toma de color="primary" */
  font-weight: 700 !important;
  text-transform: uppercase;
  transition: all 0.3s ease;
  /* Borde neón sutil */
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); 
  letter-spacing: 1px;
}

.btn-neon:hover {
  transform: translateY(-2px);
  /* Sombra más intensa al pasar el ratón */
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.5), 0 8px 15px rgba(0, 0, 0, 0.2);
}

.illustration-container {
  /* Animación tipo respiración/lujo */
  animation: floatLuxury 4s ease-in-out infinite;
}

.feature-item {
  font-size: 1.1rem;
  font-weight: 500;
  color: #A0A0A0; /* Texto gris para contraste */
}

/* Keyframes ajustados para el tema de lujo */
@keyframes pulseNeon {
  from {
    opacity: 0.9;
    transform: scale(1);
    filter: drop-shadow(0 0 2px var(--v-theme-primary));
  }
  to {
    opacity: 1;
    transform: scale(1.03);
    filter: drop-shadow(0 0 8px var(--v-theme-primary));
  }
}

@keyframes floatLuxury {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(1deg);
  }
}

/* Media Queries ajustadas al nuevo tema */
@media (max-width: 991.98px) {
  .login-form-container {
    margin: 2rem;
    padding: 2.5rem;
    border: none; /* Eliminar el borde en móvil para simplicidad */
  }
  
  .login-container {
    /* Mantener el fondo oscuro en móvil para consistencia del tema */
    background: var(--v-theme-background, #0A0A0A);
  }
}
</style>