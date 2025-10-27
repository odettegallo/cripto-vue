<template>
  <div class="home-container">
    <v-container class="py-4">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h1 class="h3 text-gradient mb-1">Cripto Enlaces</h1>
          <p class="text-dark mb-0">Portal de redirección a plataformas de compra seguras</p>
        </div>
      </div>
      
      <AdminDataTable 
        v-if="isAdmin" 
        :links="links" 
        @links-change="links"
      />
      
      <CriptoCard
        v-else
        :links="links" :current-email="currentEmail"
      />
    </v-container>
  </div>
</template>

<script>
// Componentes deben llamarse CryptoAdminTable / CryptoLinkCard
import AdminDataTable from '@/components/AdminDataTable.vue' 
import CriptoCard from '@/components/CriptoCard.vue' 
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import { onMounted, onUnmounted, computed } from 'vue';

export default {
  name: 'HomeView',
  components: { AdminDataTable, CriptoCard },
  setup() {
    const dataStore = useDataStore();
    const authStore = useAuthStore();
    let unsubscribe = null; 
    
    onMounted(() => {
      // Renombrar la action del store a subscribeToLinks()
      unsubscribe = dataStore.subscribeToLinks();
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    // Cambiar la referencia de 'getCourses' a 'getLinks'
    const links = computed(() => dataStore.getLinks); 
    const isAdmin = computed(() => authStore.isAdmin);
    const currentEmail = computed(() => authStore.currentUserEmail);

    return {
      isAdmin,
      currentEmail,
      links, // Se expone 'links'
      loading: computed(() => dataStore.loading),
      error: computed(() => dataStore.error),
    }
  },
}
</script>