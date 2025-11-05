<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 fw-bold text-gradient mb-4">
          <v-icon size="40" class="mr-2">mdi-wallet</v-icon>
          Mi Billetera Cripto
        </h1>
        <p class="text-medium-emphasis">
          Revisa tus saldos de criptomonedas y tu historial de compras.
        </p>
        
        <v-progress-linear
            v-if="walletStore.loading && !Object.keys(formattedBalances).length"
            indeterminate
            color="primary"
            class="my-4"
        ></v-progress-linear>
        
        <v-alert
            v-if="walletStore.error"
            type="error"
            title="Error de Carga"
            :text="walletStore.error"
            class="mt-4"
        ></v-alert>

      </v-col>
    </v-row>

    <v-row v-if="!walletStore.loading || Object.keys(formattedBalances).length">
      <v-col cols="12">
        <BalanceCard 
          :balances="formattedBalances" 
          :prices="currentPrices" 
          :totalValue="totalWalletValue"
        />
      </v-col>

      <v-col cols="12" class="mt-8">
        <v-card class="cripto-card-luxury pa-4" elevation="10">
            <v-card-title class="text-h5 fw-bold text-gradient mb-4">
                Historial de Transacciones
            </v-card-title>
            
            <v-data-table-virtual
                :headers="transactionHeaders"
                :items="walletStore.transactions"
                item-value="id"
                class="bg-transparent transaction-table"
                fixed-header
                :loading="walletStore.loading"
                loading-text="Cargando transacciones..."
            >
                <template v-slot:item.timestamp="{ item }">
                    {{ formatTimestamp(item.timestamp) }}
                </template>
                
                <template v-slot:item.type="{ item }">
                    <v-chip :color="item.type === 'compra' ? 'success' : 'error'" label size="small" class="font-weight-bold">
                        {{ item.type.toUpperCase() }}
                    </v-chip>
                </template>

                <template v-slot:item.totalCost="{ item }">
                    <span class="font-weight-bold">{{ formatCurrency(item.totalCost) }}</span>
                </template>
            </v-data-table-virtual>

            <v-card-text v-if="!walletStore.transactions.length && !walletStore.loading" class="text-center text-medium-emphasis">
                No tienes transacciones aún.
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/stores/walletStore';
import { useDataStore } from '@/stores/dataStore';
import BalanceCard from '@/components/BalanceCard.vue'; 

const walletStore = useWalletStore();
const dataStore = useDataStore(); 

const { getBalances } = storeToRefs(walletStore);

// Obtiene los precios de las criptos (asumiendo que están en dataStore.links)
const currentPrices = computed(() => {
  return dataStore.getLinks.reduce((acc, link) => {
    acc[link.simbolo.toLowerCase()] = link.precio || 0; 
    return acc;
  }, {});
});

// Calcula el valor total de la billetera en USD
const totalWalletValue = computed(() => {
  return Object.keys(getBalances.value).reduce((total, asset) => {
    const amount = getBalances.value[asset] || 0;
    const price = currentPrices.value[asset] || 0;
    return total + (amount * price);
  }, 0);
});

// Filtra balances con cantidad > 0 y formatea
const formattedBalances = computed(() => {
    return Object.keys(getBalances.value)
        .filter(asset => getBalances.value[asset] > 0)
        .reduce((acc, asset) => {
            acc[asset] = getBalances.value[asset];
            return acc;
        }, {});
});

const transactionHeaders = ref([
    { title: 'Fecha', align: 'start', key: 'timestamp' },
    { title: 'Cripto', align: 'start', key: 'asset' },
    { title: 'Tipo', align: 'center', key: 'type' },
    { title: 'Cantidad', align: 'end', key: 'amount' },
    { title: 'Precio Unit.', align: 'end', key: 'pricePerUnit' },
    { title: 'Costo Total', align: 'end', key: 'totalCost' },
]);

// Helper para formato de moneda
const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

// Helper para formato de fecha/hora
const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

let unsubscribe = null;

onMounted(() => {
    // Inicia la suscripción a transacciones y carga de balances al montar
    unsubscribe = walletStore.subscribeToTransactions();
});

onUnmounted(() => {
    // Limpia la suscripción al desmontar
    if (unsubscribe) {
        unsubscribe();
    }
});
</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si es necesario */
</style>