<template>
  <v-container class="py-10">
    <v-col cols="12" md="10" offset-md="1">
      <v-card class="cripto-card-luxury pa-4" elevation="10">
        <v-card-title v-if="cartStore.cartCount === 0" class="text-h5 fw-bold text-center py-5">
          <v-icon color="primary" class="mr-2">mdi-cart-off</v-icon>
          Tu carrito está vacío. ¡Empieza a comprar!
        </v-card-title>

        <v-data-table-virtual
          v-else
          :headers="headers"
          :items="cartStore.cartItems"
          item-value="linkId"
          class="bg-transparent cart-table"
          fixed-header
          hide-default-footer
          disable-pagination
          disable-sort
        >
          <template v-slot:item.item="{ item }">
            <div>
              <v-list-item-title class="text-h6 fw-bold text-primary">{{ item.nombre }}</v-list-item-title>
              <v-list-item-subtitle class="text-secondary fw-bold">{{ item.simbolo }}</v-list-item-subtitle>
            </div>
          </template>

          <template v-slot:item.priceUnit="{ item }">
            <span class="text-subtitle-2 fw-bold text-secondary">
              {{ formatCurrency(item.priceUnit) }}
            </span>
          </template>

          <template v-slot:item.cantidad="{ item }">
            <div class="d-flex align-center">
              <v-btn 
                icon 
                size="small" 
                variant="outlined" 
                color="secondary" 
                class="mr-2"
                @click="cartStore.decreaseQuantity(item.linkId)"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>

              <v-text-field
                :model-value="item.cantidad"
                label="Cantidad"
                type="number"
                readonly
                density="compact"
                style="width: 70px;"
                class="text-center"
                hide-details
              ></v-text-field>

              <v-btn 
                icon 
                size="small" 
                variant="flat" 
                color="primary" 
                class="ml-2"
                @click="cartStore.increaseQuantity(item.linkId)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </template>

          <template v-slot:item.subtotal="{ item }">
            <span class="text-subtitle-1 fw-bold text-primary">
              {{ formatCurrency(item.cantidad * item.priceUnit) }}
            </span>
          </template>

          <template v-slot:bottom></template>
        </v-data-table-virtual>
        
        <v-divider v-if="cartStore.cartCount > 0" class="mt-5 mb-4 border-primary opacity-75"></v-divider>

        <div v-if="cartStore.cartCount > 0" class="d-flex justify-space-between align-center px-4 pt-2 mb-2">
          <span class="text-h6 fw-bold text-secondary">Total de Unidades:</span>
          <span class="text-h5 fw-bold text-primary">{{ cartStore.totalUnits }}</span>
        </div>
        
        <div v-if="cartStore.cartCount > 0" class="d-flex justify-space-between align-center px-4 pt-2">
          <span class="text-h5 fw-bold text-secondary">Gran Total:</span>
          <span class="text-h4 fw-bold text-gradient">{{ formatCurrency(cartStore.cartTotal) }}</span>
        </div>

        <div v-if="cartStore.cartCount > 0" class="d-flex justify-end mt-4">
          <v-card-actions class="d-flex justify-end pt-5">
    <v-btn 
        @click="cartStore.checkout" 
        :disabled="cartStore.cartCount === 0"
        color="primary" 
        size="large" 
        elevation="10" 
        class="text-uppercase font-weight-bold"
    >
        <v-icon start>mdi-cash-lock</v-icon>
        Proceder al Pago
    </v-btn>
</v-card-actions>
        </div>
        
      </v-card>
    </v-col>
    
    <v-snackbar
      :model-value="!!cartStore.notification"
      :timeout="3000"
      color="info"
      location="bottom right"
      rounded="lg"
      min-width="300"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-bell-badge-outline</v-icon>
        {{ cartStore.notification }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cartStore';

const cartStore = useCartStore();

const headers = ref([
    { title: 'Ítem', align: 'start', key: 'item' },
    { title: 'Precio Unitario', align: 'end', key: 'priceUnit', width: '120px' },
    { title: 'Cantidad', align: 'center', key: 'cantidad', width: '180px' }, 
    { title: 'Subtotal', align: 'end', key: 'subtotal', width: '120px' }, 
]);

const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0.00';
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: value < 1 ? 6 : 2, 
    }).format(value);
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
</style>