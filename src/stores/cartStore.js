// stores/cartStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // Estado: Array de objetos { linkId, nombre, simbolo, cantidad }
  const cartItems = ref([]);
  // Estado para la notificación
  const notification = ref(null);

  // Getter: Cantidad total de elementos únicos en el carrito
  const cartCount = computed(() => cartItems.value.length);
  // Getter: Cantidad total de unidades de criptomonedas
  const totalUnits = computed(() => cartItems.value.reduce((total, item) => total + item.cantidad, 0));

  // Acción: Agregar o aumentar la cantidad de un enlace al carrito
  function addToCart(link) {
    const existingItem = cartItems.value.find(item => item.linkId === link.id);

    if (existingItem) {
      // Si ya existe, solo aumentar la cantidad en 1
      existingItem.cantidad += 1;
      setNotification(`Se agregó otra unidad de ${link.nombre} al carrito.`);
    } else {
      // Si es nuevo, añadirlo con cantidad 1
      cartItems.value.push({
        linkId: link.id,
        nombre: link.nombre,
        simbolo: link.simbolo,
        url_imagen: link.url_imagen,
        cantidad: 1,
      });
      setNotification(`${link.nombre} agregado al carrito.`);
    }
  }
  
  // Acción: Aumentar la cantidad de un ítem existente (no solicitado, pero útil para el carrito)
  function increaseQuantity(linkId) {
    const item = cartItems.value.find(item => item.linkId === linkId);
    if (item) {
      item.cantidad += 1;
    }
  }

  // Acción: Disminuir la cantidad de un ítem existente (no solicitado, pero útil para el carrito)
  function decreaseQuantity(linkId) {
    const itemIndex = cartItems.value.findIndex(item => item.linkId === linkId);
    if (itemIndex !== -1) {
      const item = cartItems.value[itemIndex];
      item.cantidad -= 1;
      if (item.cantidad <= 0) {
        // Eliminar si la cantidad llega a 0
        cartItems.value.splice(itemIndex, 1);
        setNotification(`Ítem eliminado del carrito.`);
      }
    }
  }

  // Acción para mostrar la notificación
  function setNotification(message) {
    notification.value = message;
    // La notificación se borrará automáticamente después de 3 segundos
    setTimeout(() => {
      notification.value = null;
    }, 3000);
  }

  return { 
    cartItems, 
    cartCount,
    totalUnits,
    notification,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    setNotification
  };
});