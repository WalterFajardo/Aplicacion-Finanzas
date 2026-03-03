import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'

import Login from '../views/login-page.vue'
import Register from '../views/register-page.vue'
import Dashboard from '../views/dashboard.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { 
        path: '/dashboard', 
        component: Dashboard,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Protección de rutas
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthenticated = authService.isAuthenticated()

    if (requiresAuth && !isAuthenticated) {
        // Redirigir a login si no está autenticado
        next('/login')
    } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
        // Redirigir a dashboard si ya está autenticado
        next('/dashboard')
    } else {
        next()
    }
})

export default router
