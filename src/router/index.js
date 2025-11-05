import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { 
        requiresAuth: false,
        title: 'Iniciar Sesión - Crypto Portal'
      }
    },
    {
      path: '/registro',
      name: 'Registro',
      component: () => import('@/views/RegistroView.vue'),
      meta: { 
        requiresAuth: false,
        title: 'Crear Cuenta - Crypto Portal'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Inicio - Crypto Portal'
      }
    },
    {
     path: '/enlaces',
     name: 'Enlaces',
     component: () => import('@/views/CriptoEnlacesView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Enlaces Cripto - Crypto Portal'
      }
    },
    {
     path: '/wallet',
     name: 'Wallet',
     component: () => import('@/views/WalletView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Mi Billetera - Crypto Portal'
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Administración - Crypto Portal'
      }
    },
    {
      path: '/carrito',
      name: 'Carrito',
      component: () => import('@/views/CartView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Carrito de Compras - Crypto Portal'
      }
    },
    {
      path: '/editar-cripto/:id?',
      name: 'EditarCripto',
      component: () => import('@/views/EditarCriptoView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Editar Link - Crypto Portal'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isLoggedIn 

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
