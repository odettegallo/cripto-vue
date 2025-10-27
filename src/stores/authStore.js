import {defineStore} from "pinia";
import { auth } from "@/firebase/config";
import {createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged } from "firebase/auth";
  import router from "../router/index";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    authModalMessage: ''
  }),
  getters: {
    currentUserEmail: (state) => state.user ? state.user.email : null,
    isLoggedIn: (state) => state.isAuthenticated,
    isAdmin: (state) => {
      if (!state.user || !state.user.email) return false;
      // ADAPTACIÓN: Cambiar correos de ejemplo al contexto de FinTech Cripto
      const adminEmails = ['admin@fintech.com', 'administrador@fintech.com', 'usuario1@mitienda.com'];
      return adminEmails.includes(state.user.email);
    }
  },
  actions: {
    setUser(user) {
      this.user = user;
      this.isAuthenticated = !!user;
    },
    setAuthModalMessage(message) {
      this.authModalMessage = message;
    },

    async registerUser(email, password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
      } catch (error) {
        console.error('Registration error:', error.message);
        throw error;
      }
    },

    async loginUser(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
      } catch (error) {
        console.error('Login error:', error.message);
        throw error;
      }
    },

    async logoutUser() {
      try {
        await signOut(auth);
        router.push({ name: 'Login' });
      } catch (error) {
        console.error('Logout error:', error.message);
      }
    },

    subscribeToAuthState() {
      onAuthStateChanged(auth, (user) => {
        this.setUser(user);
        if (user) {
          // ADAPTACIÓN: Mensaje de bienvenida adaptado
          this.setAuthModalMessage(`¡Bienvenido al Crypto Portal! Has ingresado como: ${user.email}`);
          if (router.currentRoute.value.name !== 'Home' && router.currentRoute.value.name !== 'Admin') {
            router.push({ name: 'Home' });
          }
        } else {
          // Cuando el usuario cierra sesión, redirige a 'Login' (manejar en logoutUser también)
          if (router.currentRoute.value.meta.requiresAuth) {
             router.push({ name: 'Login' });
          }
        }
      });
    }
  }
});