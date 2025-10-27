<template>
  <div class="register-container">
    <v-container fluid class="h-100">
      <v-row class="h-100">
        <v-col cols="12" lg="6" class="d-none d-lg-flex align-center justify-center bg-dark-panel">
          <div class="text-center text-white">
            <div class="illustration-container mb-4">
              <v-icon color="secondary" size="128" style="opacity: 0.8;">mdi-database-plus</v-icon>
            </div>
            <h3 class="fw-bold mb-3 text-gradient">Abre tu Cuenta de Cripto-Activos</h3>
            <p class="fs-5 mb-4 text-medium-emphasis">
              Asegura tu identidad en la red descentralizada hoy.
            </p>
            <div class="features-list">
              <div class="feature-item mb-2">
                <v-icon color="primary" class="me-2">mdi-lock-open-check-outline</v-icon>
                <span class="text-medium-emphasis">Verificación de Identidad Rápida</span>
              </div>
              <div class="feature-item mb-2">
                <v-icon color="primary" class="me-2">mdi-lock-open-check-outline</v-icon>
                <span class="text-medium-emphasis">Doble Factor de Autenticación (2FA)</span>
              </div>
              <div class="feature-item">
                <v-icon color="primary" class="me-2">mdi-lock-open-check-outline</v-icon>
                <span class="text-medium-emphasis">Protección de Fondos Anti-Hackeo</span>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="6" class="d-flex align-center justify-center">
          <div class="register-form-container">
            <div class="text-center mb-4">
              <div class="logo-container mb-3">
                <v-icon color="primary" size="48">mdi-fingerprint</v-icon>
              </div>
              <h2 class="fw-bold mb-2 text-secondary text-uppercase">Crear Billetera</h2>
              <p class="text-medium-emphasis">Únete a la nueva era de las finanzas</p>
            </div>

            <v-form @submit.prevent="handleRegister" class="register-form">
              <v-text-field
                v-model="formData.name"
                label="Nombre/Alias de Usuario"
                :error="!!errors.name"
                :error-messages="errors.name ? [errors.name] : []"
                prepend-inner-icon="mdi-account-circle-outline"
                density="comfortable"
                required
              />

              <v-text-field
                v-model="formData.email"
                label="Correo Electrónico (Clave Pública)"
                type="email"
                :error="!!errors.email"
                :error-messages="errors.email ? [errors.email] : []"
                prepend-inner-icon="mdi-email-send-outline"
                density="comfortable"
                required
              />

              <v-text-field
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña (Clave Privada)"
                :error="!!errors.password"
                :error-messages="errors.password ? [errors.password] : []"
                prepend-inner-icon="mdi-key-variant"
                append-inner-icon="mdi-eye"
                @click:append-inner="togglePassword"
                placeholder="Mínimo 6 caracteres, letra y número"
                density="comfortable"
                required
              />

              <v-text-field
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                label="Confirmar Contraseña"
                :error="!!errors.confirmPassword"
                :error-messages="errors.confirmPassword ? [errors.confirmPassword] : []"
                prepend-inner-icon="mdi-key-chain"
                append-inner-icon="mdi-eye"
                @click:append-inner="toggleConfirmPassword"
                density="comfortable"
                required
              />

              <v-checkbox
                v-model="formData.acceptTerms"
                :error="!!errors.acceptTerms"
                :error-messages="errors.acceptTerms ? [errors.acceptTerms] : []"
                label="Acepto los Términos de Servicio y el Contrato Inteligente"
                color="secondary"
                class="mb-4"
                required
              />

              <v-btn
                type="submit"
                color="secondary"
                size="large"
                class="w-100 mb-3 btn-neon"
                :loading="isLoading"
                prepend-icon="mdi-account-box-multiple-outline"
              >
                {{ isLoading ? 'Minando Bloque...' : 'Crear Cuenta' }}
              </v-btn>

              <v-alert v-if="generalError" type="error" variant="tonal" class="mb-3">
                {{ generalError }}
              </v-alert>

              <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-3">
                {{ successMessage }}
              </v-alert>

              <div class="text-center">
                <p class="mb-0">
                  ¿Ya tienes una cuenta?
                  <RouterLink to="/login" class="text-primary text-decoration-none fw-semibold">
                    Acceder con mi Billetera
                  </RouterLink>
                </p>
              </div>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// ... (mismo script)
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'RegistroView',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      },
      errors: {},
      generalError: '',
      successMessage: '',
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false
    }
  },
  methods: {
    validateForm() {
      // ... (misma lógica de validación)
      this.errors = {}
      
      // Name validation
      if (!this.formData.name.trim()) {
        this.errors.name = 'El nombre es requerido'
      } else if (this.formData.name.trim().length < 2) {
        this.errors.name = 'El nombre debe tener al menos 2 caracteres'
      }
      
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
      } else if (!this.isStrongPassword(this.formData.password)) {
        this.errors.password = 'La contraseña debe contener al menos una letra y un número'
      }
      
      // Confirm password validation
      if (!this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Confirma tu contraseña'
      } else if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Las contraseñas no coinciden'
      }
      
      // Terms validation
      if (!this.formData.acceptTerms) {
        this.errors.acceptTerms = 'Debes aceptar los términos y condiciones'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    isStrongPassword(password) {
      const hasLetter = /[a-zA-Z]/.test(password)
      const hasNumber = /\d/.test(password)
      return hasLetter && hasNumber
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    
    async handleRegister() {
      this.generalError = ''
      this.successMessage = ''
      
      if (!this.validateForm()) {
        return
      }
      
      this.isLoading = true
      
      try {
        const authStore = useAuthStore()
        await authStore.registerUser(this.formData.email, this.formData.password, this.formData.name)
        
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.successMessage = 'Cuenta creada exitosamente.'
        this.$router.push('/home')

      } catch (error) {
        console.error('Register error:', error)
        if (error === 'auth/email-already-in-use') {
          this.generalError = 'El correo electrónico ya está en uso'
        } else if (error === 'auth/invalid-email') {
          this.generalError = 'El correo electrónico no es válido'
        } else if (error === 'auth/weak-password') {
          this.generalError = 'La contraseña es demasiado débil'
        } else {
          this.generalError = 'Error al crear la cuenta. Intenta nuevamente.'
        }
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* Contenedor principal: Fondo muy oscuro/negro */
.register-container {
  min-height: 100vh;
  /* Usamos el color de fondo definido en main.js */
  background: var(--v-theme-background, #0A0A0A); 
  height: 100vh;
  display: flex;
  align-items: center;
}

/* Contenedor del formulario: Tarjeta oscura y elegante */
.register-form-container {
  /* Usamos el color surface oscuro definido en main.js */
  background: var(--v-theme-surface, #121212);
  padding: 3rem;
  border-radius: 12px;
  /* Sombra sutil neón/dorada */
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.05), 0 0 20px rgba(255, 215, 0, 0.05); 
  width: 100%;
  max-width: 500px;
  /* Borde sutil */
  border: 1px solid rgba(0, 255, 255, 0.1); 
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
  /* No se necesita definir background aquí, Vuetify lo toma de color="secondary" */
  font-weight: 700 !important;
  text-transform: uppercase;
  transition: all 0.3s ease;
  /* Borde neón sutil */
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2); 
  letter-spacing: 1px;
}

.btn-neon:hover {
  transform: translateY(-2px);
  /* Sombra más intensa al pasar el ratón */
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.5), 0 8px 15px rgba(0, 0, 0, 0.2);
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
    filter: drop-shadow(0 0 2px var(--v-theme-secondary));
  }
  to {
    opacity: 1;
    transform: scale(1.03);
    filter: drop-shadow(0 0 8px var(--v-theme-secondary));
  }
}

@keyframes floatLuxury {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(-1deg);
  }
}

/* Media Queries ajustadas al nuevo tema */
@media (max-width: 991.98px) {
  .register-form-container {
    margin: 2rem;
    padding: 2.5rem;
    border: none; /* Eliminar el borde en móvil para simplicidad */
  }
  
  .register-container {
    /* Mantener el fondo oscuro en móvil para consistencia del tema */
    background: var(--v-theme-background, #0A0A0A);
  }
}
</style>