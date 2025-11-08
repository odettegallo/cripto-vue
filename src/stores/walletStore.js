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
        balances: {},
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
        
        // CORREGIDO: Carga correcta de saldos desde Firebase
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
                    const data = docSnap.data();
                    // CORRECCIÓN: Extraer el objeto 'balances' si existe
                    if (data.balances && typeof data.balances === 'object') {
                        this.balances = data.balances;
                    } else {
                        // Si no hay estructura 'balances', usar todo el documento
                        // Filtrar campos que no son balances (como lastUpdate, userId)
                        const { lastUpdate, userId: uid, ...balanceData } = data;
                        this.balances = balanceData;
                    }
                } else {
                    // Inicializar estructura correcta
                    const initialBalances = {
                        BTC: 0, ETH: 0, LTC: 0, DOGE: 0, XRP: 0,
                        USDC: 0, BNB: 0, TRX: 0, STETH: 0, USDT: 0, SOL: 0
                    };
                    await setDoc(docRef, { 
                        balances: initialBalances,
                        lastUpdate: serverTimestamp(),
                        userId: userId
                    });
                    this.balances = initialBalances;
                }
            } catch (error) {
                console.error("Error al cargar saldos:", error);
                this.setError("Error al cargar los saldos del usuario.");
            } finally {
                this.setLoading(false);
            }
        },

        // CORREGIDO: Procesamiento correcto del checkout
        async processCartCheckout(cartItems, userId) {
            if (!userId || cartItems.length === 0) {
                return { success: false, error: "Missing user or items" };
            }

            this.setLoading(true);
            try {
                const balanceRef = doc(db, BALANCE_COLLECTION, userId);
                
                // Obtener saldos actuales
                const docSnap = await getDoc(balanceRef);
                let currentData = docSnap.exists() ? docSnap.data() : {};
                let currentBalances = currentData.balances || {};

                for (const item of cartItems) {
                    // CORRECCIÓN: simbolo es un string, no una función
                    const asset = item.simbolo.toUpperCase();
                    const amount = item.cantidad;
                    const priceUnit = item.priceUnit;
                    const totalCost = amount * priceUnit;

                    console.log('Procesando compra:', { asset, amount, priceUnit, totalCost });

                    // A. Registrar la transacción
                    await addDoc(collection(db, TRANSACTION_COLLECTION), {
                        userId,
                        asset: asset.toLowerCase(),
                        amount,
                        priceUnit,
                        totalCost,
                        type: 'compra',
                        timestamp: serverTimestamp(),
                        nombreCripto: item.nombre,
                    });

                    // B. Actualizar el saldo
                    const currentAmount = currentBalances[asset] || 0;
                    const newAmount = currentAmount + amount;
                    currentBalances[asset] = newAmount;
                }
                
                // Actualizar en Firebase
                await updateDoc(balanceRef, {
                    balances: currentBalances,
                    lastUpdate: serverTimestamp()
                });
                
                // Actualizar estado local
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

        // Suscripción al historial de transacciones
        subscribeToTransactions() {
            const authStore = useAuthStore();
            const userId = authStore.user?.uid;
            
            if (!userId) {
                this.transactions = [];
                this.balances = {};
                return () => {};
            }
            
            // Cargar balances al inicio
            this.fetchUserBalances(userId);
            
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
                
                // Recargar balances cuando hay nuevas transacciones
                this.fetchUserBalances(userId);
            }, (error) => {
                console.error("Error al suscribirse a transacciones:", error);
                this.setError("Error al cargar el historial de transacciones.");
            });
        }
    },
});