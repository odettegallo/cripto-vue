// stores/walletStore.js

import { defineStore } from 'pinia';
import { db } from '@/firebase/config';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    onSnapshot,
} from 'firebase/firestore';
import { useAuthStore } from './authStore'; 

const BALANCE_COLLECTION = 'user_balances';
const TRANSACTION_COLLECTION = 'transactions';

export const useWalletStore = defineStore('wallet', {
    state: () => ({
        // Saldos del usuario autenticado (clave: símbolo, valor: cantidad)
        balances: {}, // Cambiado a objeto vacío para cargar desde Firestore
        transactions: [],
        loading: false,
        error: null,
    }),

    getters: {
        getBalances: (state) => state.balances,
        getTransactions: (state) => state.transactions,
    },

    actions: {
        setLoading(status) {
            this.loading = status;
        },
        setError(message) {
            this.error = message;
        },
        
        // 1. CARGA/ACTUALIZACIÓN DE SALDOS DEL USUARIO (NUEVO)
        async fetchUserBalances(userId) {
            if (!userId) {
                this.balances = {};
                return;
            }
            try {
                this.setLoading(true);
                const docRef = doc(db, BALANCE_COLLECTION, userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Actualiza el estado local con los saldos de Firestore
                    this.balances = docSnap.data();
                } else {
                    // Inicializar el documento si no existe (importante para que se cree)
                    await setDoc(docRef, { initialized: true });
                    this.balances = {};
                }
            } catch (error) {
                console.error("Error al cargar saldos:", error);
                this.setError("Error al cargar los saldos del usuario.");
            } finally {
                this.setLoading(false);
            }
        },

        // 2. PROCESAMIENTO DE LA COMPRA DEL CARRITO (NUEVO y CRÍTICO)
        async processCartCheckout(cartItems, userId) {
            if (!userId || cartItems.length === 0) return { success: false, error: "Missing user or items" };

            this.setLoading(true);
            try {
                const balanceRef = doc(db, BALANCE_COLLECTION, userId);
                
                for (const item of cartItems) {
                    const { simbolo, cantidad, priceUnit, nombre } = item;
                    const asset = simbolo.toLowerCase();
                    const amount = cantidad;
                    const totalCost = amount * priceUnit;

                    // A. Registrar la transacción en la colección 'transactions'
                    await addDoc(collection(db, TRANSACTION_COLLECTION), {
                        userId,
                        asset,
                        amount,
                        priceUnit,
                        totalCost,
                        type: 'compra',
                        timestamp: serverTimestamp(), // Usa timestamp de Firebase
                        nombreCripto: nombre,
                    });

                    // B. Actualizar el saldo en el documento 'user_balances'
                    const docSnap = await getDoc(balanceRef);
                    const currentBalances = docSnap.exists() ? docSnap.data() : {};
                    const currentAmount = currentBalances[asset] || 0;
                    
                    const newAmount = currentAmount + amount;
                    
                    await updateDoc(balanceRef, {
                        [asset]: newAmount,
                    });
                }
                
                // Actualizar el estado local de Pinia después de las transacciones
                await this.fetchUserBalances(userId); 
                
                return { success: true };

            } catch (error) {
                console.error("Error al procesar la compra:", error);
                this.setError(`Error en la compra: ${error.message}`);
                return { success: false, error: error.message };
            } finally {
                this.setLoading(false);
            }
        },

        // 3. SUSCRIPCIÓN AL HISTORIAL DE TRANSACCIONES (Modificado para llamar a fetchUserBalances)
        subscribeToTransactions() {
            const authStore = useAuthStore();
            const userId = authStore.user?.uid;
            if (!userId) {
                 this.transactions = [];
                 this.balances = {}; 
                 return () => {};
            }
            
            // Carga los balances al suscribirse para tener datos al inicio
            this.fetchUserBalances(userId); 
            
            // ... (resto de la lógica de onSnapshot para transactions) ...
            const q = query(
                collection(db, TRANSACTION_COLLECTION),
                where("userId", "==", userId),
                orderBy("timestamp", "desc"),
                limit(50) 
            );

            return onSnapshot(q, (snapshot) => {
                this.transactions = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate(), 
                }));
            }, (error) => {
                console.error("Error al suscribirse a transacciones:", error);
                this.setError("Error al cargar el historial de transacciones.");
            });
        }
    },
});