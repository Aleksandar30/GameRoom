<template>
    <div class="landing">
        <h1>🎮 Welcome to GameRoom</h1>
        <router-link to="/login"><button>Login</button></router-link>
        <router-link to="/register"><button>Register</button></router-link>
        <button @click="playAsGuest">Play as Guest</button>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function playAsGuest() {
    const guestId = 'Guest_' + Math.floor(Math.random() * 10000)
    sessionStorage.setItem('guestUser', guestId)
    router.push('/lobby')
}
</script>

<style scoped>
.landing {
    text-align: center;
    margin-top: 100px;
}

button {
    margin: 10px;
    padding: 10px 20px;
}
</style>
