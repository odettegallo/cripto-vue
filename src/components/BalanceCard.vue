<template>
  <v-row>
    <v-col cols="12">
      <v-card class="cripto-card-luxury pa-4" elevation="10">
        <v-card-title class="text-h4 fw-bold text-gradient">Valor Total de la Billetera</v-card-title>
        <v-card-text class="py-2">
          <p class="display-3 fw-bold text-success">{{ formatCurrency(totalValue) }}</p>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col v-for="(amount, asset) in balances" :key="asset" cols="12" md="4">
      <v-card class="cripto-card-luxury h-100" elevation="8">
        <v-card-text>
          <p class="display-3 fw-bold text-gradient mb-1">{{ typeof amount === 'number' ? amount.toFixed(4) : '0.0000' }}</p>
          <p class="text-muted">{{ asset.toUpperCase() }} Balance</p>
          
          <p class="text-secondary fw-bold mt-3">
            ≈ {{ formatCurrency(amount * (prices[asset] || 0)) }} USD
          </p>
        </v-card-text>
        
        </v-card>
    </v-col>
  </v-row>
</template>

<script>
// ... (imports y setup) ...

export default {
  props: {
    balances: Object, // Propiedad proveniente del HomeView
    prices: Object,   // **NUEVA Propiedad de Precios**
    totalValue: Number, // **NUEVA Propiedad de Valor Total**
  },
  setup(props, { emit }) {
    
    // Función de ayuda para formato de moneda
    const formatCurrency = (value) => {
      // Asume que usas el formato de USD
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    };

    // ... (Lógica de control de modales) ...

    return {
      // ...
      formatCurrency,
    };
  }
};
</script>