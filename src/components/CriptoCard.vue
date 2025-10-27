<template>
  <div class="links-grid">
    <v-row>
      <v-col
        v-for="link in links.filter(l => l.activo)"
        :key="link.id"
        cols="12" md="6" lg="4"
      >
        <v-card
          class="clean-course-card h-100"
          elevation="4" 
        >
          <v-card-title class="bg-gradient-purple d-flex justify-space-between align-center text-white py-3"> 
            <h5 class="mb-0 fw-bold">{{ link.nombre }}</h5>
            <span class="text-white-50 small">{{ link.simbolo }}</span>
          </v-card-title>

          <v-card-text class="pa-0 d-flex flex-column flex-grow-1"> 
            <div class="course-image-container">
              <img :src="link.url_imagen" class="card-img-top course-image" :alt="'Imagen de ' + link.nombre">
            </div>
            
            <div class="px-4 py-3 d-flex flex-column flex-grow-1"> 
              <div class="mb-3">
                 <v-chip :color="link.activo ? 'success' : 'error'" label size="small"> 
                   <v-icon start size="18">mdi-fire</v-icon> {{ link.activo ? 'Activo' : 'Inactivo' }}
                 </v-chip>
              </div>

              <p class="text-muted flex-grow-1 mb-4">{{ link.descripcion }}</p> 

              <div class="features-bar pa-2 rounded d-flex justify-space-around align-center">
                  <small class="text-muted text-center">Redirigiendo a plataforma segura</small>
              </div>
              
              <v-card-actions class="px-0 pt-3 d-flex justify-space-end align-center border-top">
                <v-btn 
                  class="fw-bold" 
                  color="primary" 
                  variant="flat" 
                  size="small" 
                  :href="link.url_compra" 
                  target="_blank" 
                  prepend-icon="mdi-cart-arrow-right"
                  :disabled="!link.activo"
                >
                  Comprar Ahora
                </v-btn>
              </v-card-actions>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col v-if="links.filter(l => l.activo).length === 0" cols="12" class="text-center py-5">
        <v-alert type="info" variant="tonal">No hay enlaces activos disponibles en este momento.</v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'CriptoCard', // Se mantiene el nombre para simplificar
  props: {
    // ADAPTACIÓN: Se cambia 'courses' a 'links'
    links: { type: Array, required: true },
    currentEmail: { type: String, required: false, default: '' }
  },
  // ADAPTACIÓN: Se eliminan los métodos de lógica de curso (isAccessible, currency, getStatusText, etc.)
}
</script>

<style scoped>
/* Estilos adaptados */
.clean-course-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.clean-course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.course-image-container {
  max-height: 200px;
  overflow: hidden;
}
.course-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
.bg-gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border-bottom: none !important;
}
.features-bar {
  background-color: #f8f9fa; 
  border: 1px solid #e9ecef;
  border-radius: 8px;
}
</style>