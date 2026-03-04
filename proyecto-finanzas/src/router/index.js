import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'

import Login from '../views/login-page.vue'
import Register from '../views/register-page.vue'
import Dashboard from '../views/dashboard.vue'
import ScheduleView from '../views/ScheduleView.vue'
import CreditView from "@/views/CreditView.vue";
// IMPORTACIÓN DE LA NUEVA VISTA
import ClientManagementView from '../views/ClientManagementView.vue';
import ReportView from "@/views/ReportView.vue"


const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/schedule',
        name: 'Schedule',
        component: ScheduleView,
        meta: {
            requiresAuth: true,
            title: 'Cronograma de Pagos'
        }
    },
    {
        path: '/credit',
        name: 'Credit',
        component: CreditView,
        meta: {
            requiresAuth: true,
            title: 'Registro de Crédito'
        }
    },
    // REGISTRO DE LA NUEVA RUTA PARA GESTIÓN DE CLIENTES
    {
        path: '/gestionar-clientes',
        name: 'ClientManagement',
        component: ClientManagementView,
        meta: {
            requiresAuth: true,
            title: 'Gestión de Clientes'
        }
    },
    {
        path: '/reportes',
        name: 'Reportes',
        component: ReportView,
        meta: {
            requiresAuth: true,
            title: 'Reportes Financieros'
        }
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