import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import GameLobby from '../views/GameLobby.vue'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import GameRoom from '../views/GameRoom.vue'

// Helper function to check if user is logged in
function isAuthenticated(): boolean {
    return !!sessionStorage.getItem('user') || !!sessionStorage.getItem('guestUser')
}

const routes = [
    { path: '/', component: LandingPage },

    {
        path: '/login',
        component: Login,
        beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
            isAuthenticated() ? next('/lobby') : next()
        }
    },

    {
        path: '/register',
        component: Register,
        beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
            isAuthenticated() ? next('/lobby') : next()
        }
    },

    {
        path: '/lobby',
        component: GameLobby,
    },
    {
        path: '/room/:game',
        component: GameRoom,
        beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
            const user = sessionStorage.getItem('user') || sessionStorage.getItem('guestUser')
            user ? next() : next('/login')
        }
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})
