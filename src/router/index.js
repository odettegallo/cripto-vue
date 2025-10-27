import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegistroView from '../views/RegistroView.vue'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import EditarCriptoView from '../views/EditarCriptoView.vue'
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { 
        requiresAuth: false,
        title: 'Iniciar Sesión - Coin App'
      }
    },
    {
      path: '/registro',
      name: 'Registro',
      component: RegistroView,
      meta: { 
        requiresAuth: false,
        title: 'Crear Cuenta - Coin App'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
      meta: { 
        requiresAuth: true,
        title: 'Inicio - Coin App'
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminView,
      meta: { 
        requiresAuth: true,
        title: 'Administración - Coin App'
      }
    },
    {
      path: '/editar-cripto/:id?',
      name: 'EditarCripto',
      component: EditarCriptoView,
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
