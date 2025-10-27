import { defineStore } from 'pinia';
// 1. Importar la instancia de la base de datos (db)
import { db } from '@/firebase/config'; 
import { 
    collection, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc 
} from 'firebase/firestore';

// Nombre de la colección: 'enlaces_criptos'
const ENLACES_COLLECTION = 'enlaces_criptos';

export const useDataStore = defineStore('data', {
    state: () => ({
        // Estado principal: la lista de enlaces de criptomonedas
        links: [],
        loading: false,
        error: null,
    }),
    
    getters: {
        // Getter para obtener la lista de enlaces de forma reactiva
        getLinks: (state) => state.links,

        // Getter para obtener un enlace por su ID (útil para la vista de edición)
        getLinkById: (state) => (id) => {
            return state.links.find(link => link.id === id);
        },
    },

    actions: {
        setLoading(status) {
            this.loading = status;
        },
        setError(message) {
            this.error = message;
        },

        // ** R (READ) - SUSCRIPCIÓN EN TIEMPO REAL (onSnapshot) **
        // Se llama desde HomeView y AdminView en onMounted
        subscribeToLinks() {
            this.setLoading(true);
            this.setError(null);
            
            // Crea una referencia a la colección
            const q = collection(db, ENLACES_COLLECTION);
            
            // onSnapshot devuelve una función de 'unsubscribe' que se debe guardar y ejecutar
            // en onUnmounted del componente (HomeView/AdminView) para evitar fugas de memoria.
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedLinks = [];
                snapshot.forEach((doc) => {
                    // Mapea los datos, asegurando que el ID del documento esté incluido
                    fetchedLinks.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                this.links = fetchedLinks;
                this.setLoading(false);
            }, (err) => {
                // Manejo de errores de Firestore
                console.error("Error al suscribirse a enlaces:", err);
                this.setError("No se pudo cargar la lista de enlaces. Inténtalo más tarde.");
                this.setLoading(false);
            });

            // Devuelve la función de anulación de suscripción
            return unsubscribe;
        },

        // ** C (CREATE) - Agregar nuevo enlace (addDoc) **
        async addLink(linkData) {
            try {
                this.setError(null);
                // addDoc añade un nuevo documento con un ID automático
                await addDoc(collection(db, ENLACES_COLLECTION), linkData);
                return { success: true };
            } catch (error) {
                console.error("Error al agregar enlace:", error);
                this.setError(`Error al crear el enlace: ${error.message}`);
                return { success: false, error: error.message };
            }
        },

        // ** U (UPDATE) - Actualizar enlace existente (updateDoc) **
        async updateLink(id, linkData) {
            try {
                this.setError(null);
                // 1. Crea una referencia al documento específico (doc(db, colección, id))
                const linkRef = doc(db, ENLACES_COLLECTION, id);
                
                // 2. Actualiza el documento con los nuevos datos
                await updateDoc(linkRef, linkData);
                return { success: true };
            } catch (error) {
                console.error(`Error al actualizar enlace ${id}:`, error);
                this.setError(`Error al actualizar el enlace: ${error.message}`);
                return { success: false, error: error.message };
            }
        },

        // ** D (DELETE) - Eliminar enlace (deleteDoc) **
        async deleteLink(id) {
            try {
                this.setError(null);
                // 1. Crea una referencia al documento específico
                const linkRef = doc(db, ENLACES_COLLECTION, id);
                
                // 2. Elimina el documento
                await deleteDoc(linkRef);
                return { success: true };
            } catch (error) {
                console.error(`Error al eliminar enlace ${id}:`, error);
                this.setError(`Error al eliminar el enlace: ${error.message}`);
                return { success: false, error: error.message };
            }
        },
    }
});