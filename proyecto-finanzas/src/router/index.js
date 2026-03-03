import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/login-page.vue'
import Register from '../views/register-page.vue'
;

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
