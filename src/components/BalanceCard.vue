<template>
  <v-row>
    <v-col cols="12">
      <v-card class="cripto-card-luxury pa-4" elevation="10">
        <v-card-title class="text-h4-center fw-bold text-gradient">Valor Total de la Billetera</v-card-title>
        <v-card-text class="py-2">
          <p class="display-3 fw-bold text-success">{{ formatCurrency(totalValue) }}</p>
          <p v-if="totalValue === 0" class="text-muted mt-2">
            Los precios se están cargando...
          </p>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col v-for="(amount, asset) in balances" :key="asset" cols="12" md="4">
      <v-card class="cripto-card-luxury h-100" elevation="8">
        <v-card-text>
          <p class="display-3 fw-bold text-gradient mb-1">
            {{ formatAmount(amount) }}
          </p>
          <p class="text-muted">{{ asset.toUpperCase() }} Balance</p>
          
          <p class="text-secondary fw-bold mt-3">
            ≈ {{ formatCurrency(calculateAssetValue(asset, amount)) }} USD
          </p>
          <p v-if="prices[asset.toLowerCase()]" class="text-muted small mt-1">
            Precio: {{ formatCurrency(prices[asset.toLowerCase()]) }}
          </p>
          <p v-else class="text-warning small mt-1">
            <v-icon size="small">mdi-loading mdi-spin</v-icon> Cargando precio...
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    balances: {
      type: Object,
      required: true,
      default: () => ({})
    },
    prices: {
      type: Object,
      required: true,
      default: () => ({})
    },
    totalValue: {
      type: Number,
      required: true,
      default: 0
    },
  },
  setup(props) {
    
    const formatCurrency = (value) => {
      if (value === null || value === undefined || isNaN(value)) {
        return '$0.00';
      }
      
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return '$0.00';
      }
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numValue);
    };

    const formatAmount = (amount) => {
      if (typeof amount !== 'number' || isNaN(amount)) {
        return '0.0000';
      }
      return amount.toFixed(4);
    };

    const calculateAssetValue = (asset, amount) => {
      const price = props.prices[asset.toLowerCase()] || 0;
      const numAmount = Number(amount) || 0;
      const value = numAmount * price;
      
      console.log(`Calculando valor para ${asset}:`, {
        amount: numAmount,
        price,
        value
      });
      
      return value;
    };

    return {
      formatCurrency,
      formatAmount,
      calculateAssetValue,
    };
  }
};
</script>

<style scoped>
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

.text-success {
  color: #00FFFF !important;
  font-size: xx-large;
}
</style>