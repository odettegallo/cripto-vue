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
        title: 'Iniciar Sesión - Coin App'
      }
    },
    {
      path: '/registro',
      name: 'Registro',
      component: () => import('@/views/RegistroView.vue'),
      meta: { 
        requiresAuth: false,
        title: 'Crear Cuenta - Coin App'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Inicio - Coin App'
      }
    },
    {
     path: '/enlaces',
     name: 'Enlaces',
     component: () => import('@/views/CriptoEnlacesView.vue'),
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Administración - Coin App'
      }
    },
    {
      path: '/editar-cripto/:id?',
      name: 'EditarCripto',
      component: () => import('@/views/EditarCriptoView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Editar Link - Coin App'
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
