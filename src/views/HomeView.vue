<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-2 fw-bold text-gradient">
          Bienvenido al Portal Criptográfico
          <v-icon color="secondary" size="36" class="ml-2">mdi-chart-line-variant</v-icon>
        </h1>
        <p v-if="isAdmin" class="text-subtitle-1 text-success">
          <v-icon size="20" class="mr-1">mdi-security</v-icon>
          Modo Administrador Activo. Gestión de Enlaces Disponible.
        </p>
        <p v-else-if="currentEmail" class="text-subtitle-1 text-primary">
          <v-icon size="20" class="mr-1">mdi-account-check</v-icon>
          Sesión Iniciada como: {{ currentEmail }}
        </p>
        <v-divider class="my-4"></v-divider>
      </v-col>

      <!-- <v-col v-if="isAdmin" cols="12">
        <h2 class="text-h5 mb-4 fw-bold text-secondary">
          <v-icon class="mr-2">mdi-database-edit</v-icon>
          Gestión de Enlaces de Criptomonedas
        </h2>
        <AdminDataTable />
      </v-col> -->

      <v-col v-if="!isAdmin" cols="12" md="12" lg="8">
        <v-card elevation="6" rounded="lg" class="pa-5 mb-5 bg-surface">
          <h2 class="text-h4 mb-4 fw-bold text-primary">
            Cómo Funciona el Mercado de las Criptomonedas
          </h2>

          <h3 class="text-h6 mt-4 mb-2 fw-bold text-secondary">
            <v-icon class="mr-2">mdi-scale-balance</v-icon> Oferta y Demanda
          </h3>
          <p class="text-medium-emphasis">
            El precio de una criptomoneda sube o baja principalmente en función de la oferta y la demanda en las plataformas de intercambio (exchanges). Aspectos como la utilidad, la escasez, la regulación y la percepción pública influyen en este valor.
          </p>

          <h3 class="text-h6 mt-4 mb-2 fw-bold text-secondary">
            <v-icon class="mr-2">mdi-link-box</v-icon> Blockchain (Cadena de Bloques)
          </h3>
          <p class="text-medium-emphasis">
            La tecnología central que respalda a la mayoría de las criptomonedas. Es una base de datos distribuida e inmutable que registra todas las transacciones de manera segura y transparente.
          </p>

          <h3 class="text-h6 mt-4 mb-2 fw-bold text-secondary">
            <v-icon class="mr-2">mdi-swap-horizontal</v-icon> Intercambios (Exchanges) y Billeteras (Wallets)
          </h3>
          <p class="text-medium-emphasis">
            Los Exchanges son las plataformas donde los usuarios compran, venden e intercambian. Las Wallets almacenan las claves criptográficas (pública y privada) que demuestran la propiedad de tus criptomonedas.
          </p>

          <v-divider class="my-5 border-opacity-50"></v-divider>

          <h2 class="text-h4 mb-4 fw-bold text-error">
            <v-icon class="mr-2">mdi-shield-alert-outline</v-icon> Precauciones Esenciales que Debes Tomar
          </h2>
          <p class="text-medium-emphasis font-italic">
            Debido a su naturaleza volátil y a la falta de regulación en muchos países, el riesgo es inherente.
          </p>

          <h3 class="text-h6 mt-4 mb-2 fw-bold text-error">
            Riesgo Financiero
          </h3>
          <ul class="text-medium-emphasis ml-4">
            <li>Alta Volatilidad: Los precios pueden cambiar drásticamente. Nunca inviertas más dinero del que estás dispuesto a perder por completo.</li>
            <li>Falta de Protección Legal: Las criptodivisas no están respaldadas por una autoridad pública ni están cubiertas por fondos de garantía como los depósitos bancarios.</li>
          </ul>

          <h3 class="text-h6 mt-4 mb-2 fw-bold text-error">
            Riesgo de Seguridad y Fraude
          </h3>
          <ul class="text-medium-emphasis ml-4">
            <li>Investiga la Plataforma: Utiliza solo plataformas de intercambio (exchanges) conocidas y de buena reputación.</li>
            <li>Ciberseguridad: Usa la autenticación de múltiples factores (2FA) y sé extremadamente cuidadoso con el phishing.</li>
            <li>Estafas Comunes: Desconfía de "Rendimientos garantizados" o de exigencias de pagos urgentes en criptomoneda.</li>
          </ul>
        </v-card>
      </v-col>

      <v-col v-if="!isAdmin" cols="12" md="12" lg="4">
        <v-card elevation="6" rounded="lg" class="pa-5 bg-surface">
          <h2 class="text-h5 mb-4 fw-bold text-primary">
            <v-icon class="mr-2">mdi-chart-bar</v-icon> Estrategias y Consejos
          </h2>

          <h3 class="text-h6 mt-4 mb-2 fw-bold text-secondary">
            Educación y Análisis
          </h3>
          <ul class="text-medium-emphasis ml-4">
            <li>Estudia a Fondo: Investiga el proyecto, su tecnología (blockchain) y su utilidad.</li>
            <li>Comprende la Tecnología: Familiarízate con términos como wallets y smart contracts.</li>
          </ul>

          <h3 class="text-h6 mt-4 mb-2 fw-bold text-secondary">
            Estrategia de Inversión
          </h3>
          <ul class="text-medium-emphasis ml-4">
            <li>Diversifica: No pongas todos tus fondos en una sola criptomoneda.</li>
            <li>Invierte a Largo Plazo (HODL): Las fluctuaciones a corto plazo son difíciles de predecir.</li>
            <li>Usa Stop Loss: Limita tus pérdidas si decides hacer trading activo.</li>
            <li>No Pidas Dinero Prestado: Nunca utilices dinero que necesites para gastos esenciales.</li>
          </ul>

          <h3 class="text-h6 mt-4 mb-2 fw-bold text-secondary">
            Seguridad y Custodia
          </h3>
          <ul class="text-medium-emphasis ml-4">
            <li>Custodia tus Claves: La clave privada es la prueba de propiedad. Si la pierdes, pierdes tus fondos.</li>
            <li>Wallets Frías (Hardware Wallets): Recomendado para cantidades significativas.</li>
            <li>Copia de Seguridad: Guarda tu seed phrase en un lugar seguro y fuera de línea.</li>
          </ul>

          <v-divider class="my-5 border-opacity-50"></v-divider>

          
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="!isAdmin">
      <h3 class="text-h5 fw-bold text-primary mb-3">
            <v-icon class="mr-2">mdi-flash</v-icon> Enlaces de Compra (Live)
          </h3>
      <v-col cols="12">
        <v-alert v-if="loading" type="info" variant="tonal">Cargando enlaces y precios de criptomonedas...</v-alert>
        <v-alert v-if="error" type="error" variant="tonal">Error al cargar datos: {{ error }}</v-alert>

        <CriptoCard :links="links" :current-email="currentEmail" v-if="!loading && !error" />
      </v-col>
    </v-row>
  </v-container>
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
  // Se asegura de que los componentes estén disponibles
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
    // `role` no se usa directamente en el store actual, solo `isAdmin`
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

<style scoped>
.text-gradient {

  background: linear-gradient(135deg, #FFD700 0%, #00FFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}
</style>