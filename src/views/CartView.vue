<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-4 fw-bold text-gradient">
          <v-icon color="secondary" size="36" class="mr-2">mdi-cart-check</v-icon>
          Crypto Cart
        </h1>
        <v-divider class="my-4"></v-divider>
      </v-col>

      <v-col cols="12" md="8" offset-md="2">
        <v-card class="cripto-card-luxury pa-4" elevation="10">
          <v-card-title v-if="cartStore.cartCount === 0" class="text-h5 fw-bold text-center py-5">
            <v-icon color="primary" class="mr-2">mdi-cart-off</v-icon>
            Tu carrito está vacío. ¡Empieza a comprar!
          </v-card-title>

          <v-list v-else lines="two" class="bg-transparent">
            <template v-for="(item, index) in cartStore.cartItems" :key="item.linkId">
              <v-list-item class="pa-0 mb-3" :ripple="false">
                <div class="d-flex align-center justify-space-between w-100">
                  <div class="d-flex align-center">
                    <v-avatar size="48" class="mr-4" rounded="sm">
                      <v-img :src="item.url_imagen" :alt="item.nombre"></v-img>
                    </v-avatar>
                    <div>
                      <v-list-item-title class="text-h6 fw-bold text-primary">{{ item.nombre }}</v-list-item-title>
                      <v-list-item-subtitle class="text-secondary fw-bold">{{ item.simbolo }}</v-list-item-subtitle>
                    </div>
                  </div>

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
                      style="width: 80px;"
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
                  </div>
              </v-list-item>
              <v-divider v-if="index < cartStore.cartItems.length - 1" class="my-3 border-secondary opacity-50"></v-divider>
            </template>
          </v-list>
          
          <v-divider v-if="cartStore.cartCount > 0" class="mt-5 mb-4 border-primary opacity-75"></v-divider>

          <div v-if="cartStore.cartCount > 0" class="d-flex justify-space-between align-center px-4 pt-2">
            <span class="text-h6 fw-bold text-secondary">Total de Unidades:</span>
            <span class="text-h5 fw-bold text-primary">{{ cartStore.totalUnits }}</span>
          </div>

          <div v-if="cartStore.cartCount > 0" class="d-flex justify-end mt-4">
            <v-btn color="success" size="large" prepend-icon="mdi-cash-register" class="fw-bold">
              Proceder al Pago
            </v-btn>
          </div>
          
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore';

const cartStore = useCartStore();
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