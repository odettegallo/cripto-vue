<template>
  <div class="home-container">
    <v-container class="py-4">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h1 class="h3 text-gradient mb-1">Crypto Enlaces</h1>
          <p class="text-dark mb-0">Portal de compra segura</p>
        </div>
      </div>
      
      <AdminDataTable 
        v-if="role === isAdmin" 
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
import AdminDataTable from '@/components/AdminDataTable.vue' 
import CriptoCard from '@/components/CriptoCard.vue' 
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import { onMounted, onUnmounted, computed } from 'vue';

export default {
  name: 'CriptoEnlacesView',
  components: { AdminDataTable, CriptoCard },
  setup() {
    const dataStore = useDataStore();
    const authStore = useAuthStore();
    let unsubscribe = null; 
    
    onMounted(() => {
      unsubscribe = dataStore.subscribeToLinks();
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    const links = computed(() => dataStore.getLinks); 
    const role = computed(() => authStore.role);
    const isAdmin = computed(() => authStore.isAdmin);
    const currentEmail = computed(() => authStore.currentUserEmail);

    return {
      isAdmin,
      currentEmail,
      links,
      role,
      loading: computed(() => dataStore.loading),
      error: computed(() => dataStore.error),
    }
  },
}
</script>