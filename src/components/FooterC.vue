<template>
  <v-footer class="py-4 mt-10 bg-black"> <v-container>
      <div class="d-flex flex-column flex-md-row align-center justify-space-between mb-4">
        <div class="d-flex align-center mb-4 mb-md-0">
          <v-icon size="24" color="primary" class="me-2 logo-icon">mdi-currency-btc</v-icon>
          <span class="text-h6 font-weight-bold text-gradient">Crypto Portal</span>
        </div>
        
        <div class="d-flex">
          <v-btn v-for="icon in socialIcons" :key="icon.icon" 
                 :icon="icon.icon" :href="icon.url" target="_blank" 
                 variant="plain" size="small" 
                 :class="icon.class" 
                 class="mx-1"
          />
        </div>
      </div>
      
      <v-divider class="mb-5 border-opacity-50" color="primary" />

      <v-row>
        <v-col cols="12" sm="6" md="3">
          <div class="text-subtitle-1 font-weight-bold mb-3 text-primary">Información Legal</div>
          <div v-for="link in legalLinks" :key="link.title">
            <RouterLink :to="link.to" class="footer-link">{{ link.title }}</RouterLink>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <div class="text-subtitle-1 font-weight-bold mb-3 text-primary">Recursos y Ayuda</div>
          <div v-for="link in resourceLinks" :key="link.title">
            <RouterLink :to="link.to" class="footer-link">{{ link.title }}</RouterLink>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <div class="text-subtitle-1 font-weight-bold mb-3 text-primary">Contáctanos</div>
          <div class="d-flex align-start mb-2">
            <v-icon color="secondary" size="18" class="me-2 mt-1">mdi-email-outline</v-icon>
            <span class="text-white">soporte@cryptoportal.com</span>
          </div>
          <div class="d-flex align-start">
            <v-icon color="secondary" size="18" class="me-2 mt-1">mdi-map-marker-outline</v-icon>
            <span class="text-white">Crypto Tower, N° 1, Blockchain City</span>
          </div>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <div class="text-subtitle-1 font-weight-bold mb-3 text-primary">Newsletter Exclusivo</div>
          <p class="text-white text-caption mb-3">Recibe las últimas noticias del mercado cripto.</p>
          <v-text-field
            density="compact"
            label="Tu Email"
            variant="solo-filled"
            hide-details
            class="mb-2"
            bg-color="#212121"
          />
          <v-btn color="secondary" size="small" block class="font-weight-bold">Suscribirse</v-btn>
        </v-col>
      </v-row>
      
      <v-divider class="my-5 border-opacity-50" color="primary" />

      <div class="d-flex flex-column flex-md-row justify-space-between align-center">
        <span class="text-caption text-white text-center text-md-left mb-2 mb-md-0">
          © {{ currentYear }} Crypto Portal. Todos los derechos reservados.
        </span>
        <span class="text-caption text-primary">
          Desarrollado con <v-icon size="14" color="red-darken-2">mdi-heart</v-icon> y <span class="text-secondary">Vue/Vuetify.</span>
        </span>
      </div>
      
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data: () => ({
    currentYear: new Date().getFullYear(),
    legalLinks: [
      { title: 'Términos y Condiciones', to: '/terminos' },
      { title: 'Política de Privacidad', to: '/privacidad' },
      { title: 'Aviso Legal', to: '/aviso-legal' },
    ],
    resourceLinks: [
      { title: 'Preguntas Frecuentes', to: '/faq' },
      { title: 'Blog Cripto', to: '/blog' },
      { title: 'Guías Educativas', to: '/guias' },
    ],
    socialIcons: [
      { icon: 'mdi-twitter', url: 'https://twitter.com/cryptoportal', class: 'btn-neon-outline-social' },
      { icon: 'mdi-linkedin', url: 'https://linkedin.com/company/cryptoportal', class: 'btn-neon-outline-social' },
      { icon: 'mdi-github', url: 'https://github.com/cryptoportal', class: 'btn-neon-outline-social' },
      { icon: 'mdi-youtube', url: 'https://youtube.com/@cryptoportal-channel', class: 'btn-neon-outline-social' },
    ],
  }),
};
</script>

<style scoped>
/* Enlaces del Footer */
.footer-link {
  color: #A0A0A0 !important;
  text-decoration: none;
  display: block;
  padding: 4px 0;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}
.footer-link:hover {
  color: var(--v-theme-secondary) !important;
  text-decoration: underline;
}

/* Efecto de Texto Gradiente (Tomado de App.vue) */
.text-gradient {
  background: linear-gradient(135deg, #FFD700 0%, #00FFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Botones de Redes Sociales: Outline Neón */
.btn-neon-outline-social {
    color: var(--v-theme-secondary) !important;
    border-color: var(--v-theme-secondary) !important;
    transition: all 0.3s ease;
    border: 1px solid var(--v-theme-secondary);
    border-radius: 50%;
}
.btn-neon-outline-social:hover {
    background-color: rgba(0, 255, 255, 0.1) !important;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
    transform: scale(1.05);
}

/* Icono del logo con el pulso neón de NavBar */
.logo-icon {
    animation: pulseNeon 1.5s infinite alternate;
}
@keyframes pulseNeon {
  0% { transform: scale(1); filter: drop-shadow(0 0 1px var(--v-theme-secondary)); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 8px var(--v-theme-secondary)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 1px var(--v-theme-secondary)); }
}
</style>