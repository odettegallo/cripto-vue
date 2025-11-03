<template>
  <v-container class="py-10">
    <v-col cols="12" md="8" offset-md="2">
        <v-card class="cripto-card-luxury pa-4" elevation="10">
          <v-card-title v-if="cartStore.cartCount === 0" class="text-h5 fw-bold text-center py-5">
            <v-icon color="primary" class="mr-2">mdi-cart-off</v-icon>
            Tu carrito está vacío. ¡Empieza a comprar!
          </v-card-title>

          <v-list v-else lines="two" class="bg-transparent">
            <v-list-item class="pa-0 mb-3" :ripple="false">
                <div class="d-flex justify-space-between w-100 font-weight-bold text-uppercase text-caption text-secondary">
                    <span class="ml-4">Ítem</span>
                    <div class="d-flex align-center text-right">
                        <span class="mr-4">Precio Unitario</span>
                        <span style="width: 110px;" class="text-center">Cantidad</span>
                        <span style="min-width: 100px;" class="ml-4">Subtotal</span>
                    </div>
                </div>
            </v-list-item>
            <v-divider class="my-3 border-secondary opacity-50"></v-divider>

            <template v-for="(item, index) in cartStore.cartItems" :key="item.linkId">
              <v-list-item class="pa-0 mb-3" :ripple="false">
                <div class="d-flex align-center justify-space-between w-100">
                  <div class="d-flex align-center">
                    <div>
                      <v-list-item-title class="text-h6 fw-bold text-primary">{{ item.nombre }}</v-list-item-title>
                      <v-list-item-subtitle class="text-secondary fw-bold">{{ item.simbolo }}</v-list-item-subtitle>
                    </div>
                  </div>

                  <div class="d-flex align-center">
                    <div class="text-right mr-4" style="width: 120px;">
                        <span class="text-subtitle-2 fw-bold text-secondary">
                            {{ formatCurrency(item.priceUnit) }}
                        </span>
                    </div>
                    
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
                    
                    <div class="text-right ml-4" style="min-width: 100px;">
                        <span class="text-subtitle-1 fw-bold text-primary">
                            {{ formatCurrency(item.cantidad * item.priceUnit) }}
                        </span>
                    </div>
                  </div>
                </div>
              </v-list-item>
              <v-divider v-if="index < cartStore.cartItems.length - 1" class="my-3 border-secondary opacity-50"></v-divider>
            </template>
          </v-list>
          
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
            <v-btn 
              color="success" 
              size="large" 
              prepend-icon="mdi-cash-register" 
              class="fw-bold"
              @click="cartStore.checkout"
            >
              Proceder al Pago (Simulado)
            </v-btn>
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
import { useCartStore } from '@/stores/cartStore';

const cartStore = useCartStore();

// Función de utilidad para formato de moneda (usando USD como referencia para criptos)
const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0.00';
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        // Ajustar la precisión para precios muy bajos
        maximumFractionDigits: value < 1 ? 6 : 2, 
    }).format(value);
};
</script>

<style scoped>
/* Estilos basados en la estética Cripto */
.cripto-card-luxury {
  background-color: #1a1a1a !important; 
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
}

/* Replicar la clase de gradiente del App.vue */
.text-gradient {
  background: linear-gradient(135deg, #FFD700 0%, #00FFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>