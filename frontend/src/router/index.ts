// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import GameLobby from '../views/GameLobby.vue'

const routes = [
    { path: '/', component: LandingPage },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/lobby', component: GameLobby }, // for authenticated or guest
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
