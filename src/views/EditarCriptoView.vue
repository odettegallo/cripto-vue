// EditarCriptoView.vue

<template>
  <div class="editar-curso-container">
    <v-container class="py-5">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-gradient">Editar Cripto: {{ linkCache.nombre || 'Cargando...' }}</h1>
        <p class="lead text-muted">Modifica la información del enlace a la plataforma de compra</p>
      </div>
      
      <v-alert v-if="loading || !linkCache.id" type="info" variant="tonal" class="text-center">
            Cargando datos del enlace...
          </v-alert>
          <v-alert v-else-if="error || !link" type="error" variant="tonal">
            Enlace no encontrado o error de carga: {{ error || 'ID de enlace inválido.' }}
          </v-alert>
          
          <v-card v-else class="p-4" elevation="2">
            <v-form @submit.prevent="updateLinkWithConfirmation">
              <v-row class="g-3">
                
                <v-col cols="12" md="3">
                  <v-text-field label="ID" v-model="linkCache.id" required readonly /> 
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field label="Nombre" v-model="linkCache.nombre" required />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select label="Estado" v-model="linkCache.activo" :items="[true, false]" required />
                </v-col>
                
                <v-col cols="12" md="4">
                  <v-text-field label="Símbolo" v-model="linkCache.simbolo" required />
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field label="URL de Compra" v-model="linkCache.url_compra" required />
                </v-col>
                
                <v-col cols="12">
                  <v-text-field label="URL de Imagen" v-model="linkCache.url_imagen" />
                </v-col>
                
                <v-col cols="12">
                  <v-textarea label="Descripción" v-model="linkCache.descripcion" rows="3" required />
                </v-col>
                
                <v-col cols="12" class="text-end mt-4">
                  </v-col>

              </v-row>
            </v-form>
          </v-card>
    
    </v-container>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '@/stores/dataStore'; 
import { computed, ref, watchEffect } from 'vue';

export default {
  name: 'EditarCriptoView', 
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useDataStore(); 
    
    const linkCache = ref({});
    const linkId = route.params.id;

    const alertMessage = ref('');
    const alertType = ref('');

    const link = computed(() => {
      return store.getLinks.find(c => c.id === linkId); 
    });

    watchEffect(() => {
      if (link.value) {
        linkCache.value = JSON.parse(JSON.stringify(link.value));
        linkCache.value.activo = link.value.activo === 'true' || link.value.activo === true;
      }
    });

    const showAlert = (message, type = 'alert-success') => { /* ... */ };
    const clearAlert = () => { /* ... */ };

    const updateLinkWithConfirmation = async () => {
      clearAlert();
      
      const updatedData = {
        id: linkCache.value.id.trim(),
        nombre: linkCache.value.nombre.trim(),
        simbolo: linkCache.value.simbolo.trim(),
        url_compra: linkCache.value.url_compra.trim(),
        url_imagen: linkCache.value.url_imagen.trim(),
        descripcion: linkCache.value.descripcion.trim(),
        activo: linkCache.value.activo === true, 
      };

      const result = await store.updateLink(linkId, updatedData);

      if (result.success) {
        showAlert(`✅ Enlace "${linkCache.value.nombre}" actualizado correctamente. Redirigiendo...`, 'alert-success');
        
        setTimeout(() => {
          router.push({ name: 'Admin' }); 
        }, 1500);

      } else {
        showAlert(`❌ Error al actualizar enlace: ${result.error}`, 'alert-danger');
      }
    };
    
    return {
      linkCache,
      link, 
      loading: computed(() => store.loading),
      error: computed(() => store.error),
      updateLinkWithConfirmation,
      alertMessage,
      alertType,
      clearAlert,
    }
  }
}
</script>