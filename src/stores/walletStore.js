import { defineStore } from 'pinia';
// Importar db (asume que ya está configurado en '@/firebase/config')
import { db } from '@/firebase/config'; 
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuthStore } from './authStore'; 

const BALANCES_COLLECTION = 'balances';

export const useWalletStore = defineStore('wallet', {
    state: () => ({
        // Estado: un objeto que contendrá los balances (ej: { 'USD': 1000, 'BTC': 0.5 })
        balances: {},
        walletLoading: false,
        walletError: null,
    }),

    getters: {
        // Devuelve el balance de un activo específico (ej: getBalance('USD'))
        getBalance: (state) => (asset) => state.balances[asset] || 0,
        // Calcula el valor total basado en los precios en vivo (integración futura con dataStore)
        getTotalPortfolioValue: (state) => (cryptoPrices) => {
            let totalUSD = state.balances['USD'] || 0;

            // Recorre los balances de criptomonedas y calcula su valor en USD
            for (const asset in state.balances) {
                if (asset !== 'USD' && state.balances[asset] > 0) {
                    // Mapeo simple: BTC -> bitcoin, ETH -> ethereum (necesitas un mapeo real)
                    const apiId = asset.toLowerCase(); 
                    
                    // Asegura que tienes el precio de la API
                    if (cryptoPrices[apiId] && cryptoPrices[apiId].usd) {
                        totalUSD += state.balances[asset] * cryptoPrices[apiId].usd;
                    }
                }
            }
            return totalUSD;
        }
    },

    actions: {
        // Función para obtener el documento de balances del usuario (o crearlo)
        async fetchUserBalances() {
            const authStore = useAuthStore();
            const userId = authStore.user?.uid;
            if (!userId) return;

            this.walletLoading = true;
            this.walletError = null;

            try {
                const balanceRef = doc(db, BALANCES_COLLECTION, userId);
                const docSnap = await getDoc(balanceRef);

                if (docSnap.exists()) {
                    this.balances = docSnap.data();
                } else {
                    // Si no existe, crea un balance inicial (ej: 1000 USD simulados)
                    this.balances = { 'USD': 1000.00 }; 
                    await setDoc(balanceRef, this.balances);
                }

            } catch (error) {
                console.error("Error al cargar balances:", error);
                this.walletError = "Error al cargar la billetera simulada.";
            } finally {
                this.walletLoading = false;
            }
        },
        
        // ** Acción Clave: Simular Carga de Fondos **
        async loadSimulatedFunds(amount) {
            const authStore = useAuthStore();
            const userId = authStore.user?.uid;
            if (!userId || amount <= 0) return { success: false, error: "Datos inválidos." };

            const currentUSD = this.balances['USD'] || 0;
            const newUSD = currentUSD + amount;
            
            try {
                const balanceRef = doc(db, BALANCES_COLLECTION, userId);
                
                // Actualiza solo el campo 'USD'
                await updateDoc(balanceRef, { 'USD': newUSD }); 
                
                // Actualiza el estado local (reactivo)
                this.balances['USD'] = newUSD; 
                
                return { success: true };

            } catch (error) {
                console.error("Error al cargar fondos simulados:", error);
                return { success: false, error: error.message };
            }
        },
        
        // ** Acción Clave: Simular Compra de Cripto **
        async simulateCryptoPurchase(cryptoSymbol, amountUSD, cryptoAmount) {
            const authStore = useAuthStore();
            const userId = authStore.user?.uid;
            
            if (!userId || amountUSD > this.balances['USD'] || amountUSD <= 0) {
                return { success: false, error: "Fondos insuficientes o monto inválido." };
            }

            const newUSD = this.balances['USD'] - amountUSD;
            const currentCrypto = this.balances[cryptoSymbol] || 0;
            const newCrypto = currentCrypto + cryptoAmount;

            try {
                const balanceRef = doc(db, BALANCES_COLLECTION, userId);
                
                // Usar un objeto para actualizar ambos balances
                const updatePayload = {
                    'USD': newUSD,
                    [cryptoSymbol]: newCrypto, // Clave dinámica
                };

                await updateDoc(balanceRef, updatePayload);
                
                // Actualiza el estado local
                this.balances['USD'] = newUSD;
                this.balances[cryptoSymbol] = newCrypto;
                
                return { success: true };
                
            } catch (error) {
                 console.error("Error en la compra simulada:", error);
                 return { success: false, error: error.message };
            }
        }
    }
});