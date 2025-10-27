<template>
  <div class="admin-container">
    <v-container class="py-5">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-gradient">Administración de Enlaces Cripto</h1>
        <p class="lead text-muted">Gestiona los enlaces a plataformas de compra</p>
      </div>
      
      <v-row>
        <v-col cols="12">
          
          <v-alert v-if="loading" type="info" variant="tonal" class="text-center">
            <v-progress-circular indeterminate size="20" class="me-2"></v-progress-circular>
            Cargando enlaces desde Firebase en tiempo real...
          </v-alert>

          <v-alert v-else-if="error" type="error" variant="tonal">
            Error al cargar enlaces: {{ error }}
          </v-alert>
          
          <AdminLinksManager v-else /> 

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// El nombre del componente interno debe reflejar la nueva función
import AdminLinksManager from '@/components/AdminDataTable.vue'; 
import { useDataStore } from '@/stores/dataStore';
import { onMounted, onUnmounted } from 'vue';

export default {
  name: 'AdminView',
  // Renombrar componentes locales si aplica
  components: { AdminLinksManager }, 

  setup() {
    // Renombrar el store si aplica, o se asume useDataStore
    const dataStore = useDataStore(); 
    let unsubscribe = null; 

    onMounted(() => {
      // Renombrar la action
      unsubscribe = dataStore.subscribeToLinks(); 
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    return {
      // El estado es genérico (loading/error)
      loading: dataStore.loading, 
      error: dataStore.error, 
    }
  },
};
</script>