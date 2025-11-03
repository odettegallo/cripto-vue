// stores/cartStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([]);
  const notification = ref(null);

  const cartCount = computed(() => cartItems.value.length);
  const totalUnits = computed(() => cartItems.value.reduce((total, item) => total + item.cantidad, 0));
  

  function addToCart(link, priceUnit) {
    const existingItem = cartItems.value.find(item => item.linkId === link.id);

    if (existingItem) {
      existingItem.cantidad += 1;
      setNotification(`Se agregó otra unidad de ${link.nombre} al carrito.`);
    } else {
      cartItems.value.push({
        linkId: link.id,
        nombre: link.nombre,
        simbolo: link.simbolo,
        url_imagen: link.url_imagen,
        cantidad: 1,
        priceUnit: priceUnit,
      });
      setNotification(`${link.nombre} agregado al carrito.`);
    }
  }
  
  const cartTotal = computed(() => {
    const total = cartItems.value.reduce((total, item) => total + (item.cantidad * item.priceUnit), 0);
    return Math.round(total * 100) / 100;
  });


  function increaseQuantity(linkId) {
    const item = cartItems.value.find(item => item.linkId === linkId);
    if (item) {
      item.cantidad += 1;
    }
  }

  function decreaseQuantity(linkId) {
    const itemIndex = cartItems.value.findIndex(item => item.linkId === linkId);
    if (itemIndex !== -1) {
      const item = cartItems.value[itemIndex];
      item.cantidad -= 1;
      if (item.cantidad <= 0) {
        cartItems.value.splice(itemIndex, 1);
        setNotification(`Ítem eliminado del carrito.`);
      }
    }
  }

  function setNotification(message) {
    notification.value = message;
    setTimeout(() => {
      notification.value = null;
    }, 3000);
  }

  function checkout() {
    if (cartItems.value.length > 0) {
      cartItems.value = [];
      setNotification('Compra realizada con éxito.');
    }else {
      setNotification('El carrito está vacío.');
    }
  }

  return { 
    cartItems, 
    cartCount,
    totalUnits,
    cartTotal,
    notification,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    setNotification,
    checkout
  };
},{  persist: true,
},   
);

