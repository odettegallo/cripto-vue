<template>
  <div class="links-grid">
    <v-row>
      <v-col v-for="link in links.filter(l => l.activo)" :key="link.id" cols="12" md="6" lg="4">
        <v-card class="cripto-card-luxury h-100" elevation="8">
          <v-card-title class="bg-gradient-cripto d-flex justify-space-between align-center py-3">
            <h5 class="mb-0 fw-bold text-uppercase text-primary">{{ link.nombre }}</h5>
            <span class="small fw-bold text-primary">{{ link.simbolo }}</span>
          </v-card-title>

          <v-card-text class="pa-0 d-flex flex-column flex-grow-1">
            <div class="link-image-container">
              <img :src="link.url_imagen" class="card-img-top link-image" :alt="'Imagen de ' + link.nombre">
            </div>

            <div class="px-4 py-3 d-flex flex-column flex-grow-1">
              <div class="mb-3">
                <v-chip :color="link.activo ? 'secondary' : 'error'" label size="small" class="fw-bold chip-status">
                  <v-icon start size="18">mdi-flash</v-icon> {{ link.activo ? 'LIVE' : 'DOWN' }}
                </v-chip>
              </div>

              <p class="text-medium-emphasis flex-grow-1 mb-4">{{ link.descripcion }}</p>

              <div class="features-bar pa-2 rounded d-flex justify-space-around align-center">
                <v-icon color="success" size="18" class="me-2">mdi-lock-check-outline</v-icon>
                <small class="text-primary text-center fw-bold">Plataforma de Trading Segura</small>
              </div>

              <v-card-actions class="px-0 pt-3 d-flex justify-space-end align-center border-top">
                  <span class="me-auto fw-bold text-h6">
                    {{ cryptoPrices[link.id] || 'Cargando...' }}
                  </span>
                <v-btn class="fw-bold" color="primary" variant="flat" size="small" @click="handleAddToCart(link)" :href="link.url_afiliado"
                  target="_blank" prepend-icon="mdi-cart-plus" :disabled="!link.activo">

                  Agregar al Carrito

                </v-btn>

              </v-card-actions>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="links.filter(l => l.activo).length === 0" cols="12" class="text-center py-5">
        <v-alert type="info" variant="tonal">No hay enlaces activos disponibles en este momento.</v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {ref,watch,onMounted} from 'vue';
import {useCartStore} from '@/stores/cartStore';

const symbolToCoingeckoId = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'LTC': 'litecoin',
  'DOGE': 'dogecoin',
  'XRP': 'ripple',
  'USDC': 'usd-coin',
  'BNB': 'binancecoin',
  'TRX': 'tron',
  'STETH': 'staked-ether',
  'USDT': 'tether',
  'SOL': 'solana',

};


export default {
  name: 'CriptoCard',
  props: {
    links: { type: Array, required: true },
    currentEmail: { type: String, required: false, default: '' }
  },
  setup(props) {

    const cryptoPrices = ref({});
    const cryptoRawPrices = ref({});
    const cartStore = useCartStore(); 

    const handleAddToCart = (link) => {
      const price = cryptoRawPrices.value[link.id] || 0;
      if (typeof price === 'number' && price > 0) {
        cartStore.addToCart(link, price);
      } else {
        cartStore.setNotification({
          type: 'error',
          message: `No se pudo agregar ${link.nombre} al carrito debido a un precio inválido.`,
        });
      }

      };


    const loadPrices = async () => {
      cryptoPrices.value = {}; // Limpiar estado
      cryptoRawPrices.value = {};

      const activeLinks = props.links.filter(l => l.activo);
      
      // 2. Recolectar todos los IDs de CoinGecko únicos necesarios
      const coingeckoIds = activeLinks
        .map(link => symbolToCoingeckoId[link.simbolo.toUpperCase()])
        .filter(id => id); // Filtrar IDs no encontrados en el mapa
      
      if (coingeckoIds.length === 0) {
        console.warn("No se encontraron IDs de CoinGecko mapeados para los enlaces activos.");
        return;
      }

      const idsString = coingeckoIds.join(','); // Unir IDs para la solicitud por lotes (batch)

      try {
        // 3. Solicitud por lotes a la API de CoinGecko
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd`
        );
        
        if (!response.ok) {
          throw new Error(`Fallo en la API de CoinGecko: ${response.statusText}`);
        }

        const data = await response.json();

        // 4. Procesar la respuesta y actualizar el estado
        for (const link of activeLinks) {
          const coingeckoId = symbolToCoingeckoId[link.simbolo.toUpperCase()];

          if (coingeckoId && data[coingeckoId] && data[coingeckoId].usd) {
            const price = data[coingeckoId].usd;
            cryptoRawPrices.value[link.id] = price;
            
            // Formatear el precio a USD (ajustando decimales para precios pequeños)
            const formattedPrice = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: price < 1 ? 6 : 2 
            }).format(price);
            
            cryptoPrices.value[link.id] = formattedPrice;
          } else {
            cryptoPrices.value[link.id] = 'N/A';
            cryptoRawPrices.value[link.id] = null;
          }
        }

      } catch (error) {
        console.error("Error al cargar precios de criptomonedas:", error);
        // Mostrar un error en la tarjeta si falla la API
        for (const link of activeLinks) {
          cryptoPrices.value[link.id] = 'Error API';
          cryptoRawPrices.value[link.id] = null;
        }
      }
    };

    watch(
      () => props.links, 
      (newLinks) => {
        // Ejecuta loadPrices solo si hay enlaces activos para evitar la advertencia
        if (newLinks && newLinks.some(l => l.activo)) { 
          loadPrices();
        }
      },
      { immediate: true } // Ejecutar inmediatamente para la carga inicial (si ya hay datos en la prop)
    );
    
    setInterval(loadPrices, 60000);
  
    
    

    return {
      cryptoPrices,
      handleAddToCart
    };
  }
};
</script>

<style scoped>
/* 1. Tarjeta Principal: Oscura, Lujosa */
.cripto-card-luxury {
  border-radius: 16px;
  overflow: hidden;
  /* Fondo oscuro (surface) */
  background-color: var(--v-theme-surface) !important;
  /* Borde sutil dorado/neón */
  border: 1px solid rgba(255, 215, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
  /* Sombra sutil oscura */
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4) !important;
}

/* Efecto hover: Elevación y Sombra Neón */
.cripto-card-luxury:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 255, 255, 0.2), 0 5px 15px rgba(0, 0, 0, 0.5) !important;
}

/* 2. Imagen */
.link-image-container {
  max-height: 200px;
  overflow: hidden;
  background-color: #000;
  /* Fondo negro para imágenes */
  border-bottom: 2px solid var(--v-theme-secondary);
  /* Separador Neón */
}

.link-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.cripto-card-luxury:hover .link-image {
  opacity: 1;
}

/* 3. Título con Gradiente */
.bg-gradient-cripto {
  /* Fondo es el gradiente Gold/Neon */
  background: linear-gradient(90deg, var(--v-theme-primary) 0%, var(--v-theme-secondary) 100%) !important;
  /* El color del texto del nombre y símbolo se establece en la plantilla con la clase text-primary */
}

/* 4. Barra de Seguridad/Features */
.features-bar {
  /* Fondo muy oscuro, borde neón */
  background-color: #0A0A0A;
  border: 1px solid var(--v-theme-primary);
  border-radius: 8px;
  padding: 8px !important;
}

/* 5. Chip de Estado */
.chip-status {
  letter-spacing: 1px;
}

/* 6. Botón de Compra: Neón/Gold */
.btn-buy-neon {
  font-weight: 800 !important;
  text-transform: uppercase;
  transition: all 0.3s ease;
  /* El color del botón lo da color="primary" (Gold) */
  background-color: var(--v-theme-primary) !important;
  /* Forzamos el texto a negro para contraste en el fondo dorado */
  color: #0A0A0A !important;
  /* Sombra de neón */
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.btn-buy-neon:hover {
  background-color: var(--v-theme-secondary) !important;
  /* Cambia a Neón en hover */
  color: #0A0A0A !important;
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.8);
  transform: scale(1.02);
}
</style>