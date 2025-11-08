<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 fw-bold text-gradient mb-4">
          <v-icon color="secondary" size="40" class="mr-2 wallet">mdi-wallet</v-icon>
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
                
                <template v-slot:item.pricePerUnit="{ item }">
                    <span>{{ formatCurrency(item.pricePerUnit || item.priceUnit) }}</span>
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

// CORREGIDO: Obtiene los precios actuales desde CoinGecko API
const currentPrices = ref({});

// Mapeo de símbolos a IDs de CoinGecko
const symbolToCoingeckoId = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'ltc': 'litecoin',
  'doge': 'dogecoin',
  'xrp': 'ripple',
  'usdc': 'usd-coin',
  'bnb': 'binancecoin',
  'trx': 'tron',
  'steth': 'staked-ether',
  'usdt': 'tether',
  'sol': 'solana',
};

// Función para cargar precios desde CoinGecko
const loadPrices = async () => {
  try {
    const symbols = Object.keys(getBalances.value).filter(s => getBalances.value[s] > 0);
    if (symbols.length === 0) return;

    const coingeckoIds = symbols
      .map(symbol => symbolToCoingeckoId[symbol.toLowerCase()])
      .filter(id => id);

    if (coingeckoIds.length === 0) return;

    const idsString = coingeckoIds.join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd`
    );

    if (!response.ok) throw new Error('Error al obtener precios');

    const data = await response.json();
    
    const prices = {};
    symbols.forEach(symbol => {
      const coingeckoId = symbolToCoingeckoId[symbol.toLowerCase()];
      if (coingeckoId && data[coingeckoId] && data[coingeckoId].usd) {
        prices[symbol.toLowerCase()] = data[coingeckoId].usd;
      }
    });

    currentPrices.value = prices;
    console.log('Precios cargados:', prices);
  } catch (error) {
    console.error('Error al cargar precios:', error);
  }
};

// CORREGIDO: Calcula el valor total con los precios correctos
const totalWalletValue = computed(() => {
  let total = 0;
  Object.keys(getBalances.value).forEach(asset => {
    const amount = getBalances.value[asset] || 0;
    const price = currentPrices.value[asset.toLowerCase()] || 0;
    total += amount * price;
  });
  console.log('Total calculado:', total);
  return total;
});

// Filtra balances con cantidad > 0
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

const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

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

onMounted(async () => {
    unsubscribe = walletStore.subscribeToTransactions();
    // Cargar precios iniciales
    await loadPrices();
    // Actualizar precios cada minuto
    setInterval(loadPrices, 60000);
});

onUnmounted(() => {
    if (unsubscribe) {
        unsubscribe();
    }
});
</script>

<style scoped>
.wallet {
  color: aliceblue;
}

.cripto-card-luxury {
  background-color: #1a1a1a !important; 
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
}

.text-gradient {
  background: linear-gradient(135deg, #FFD700 0%, #00FFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>