<template>
    <div class="landing">
        <header>
            <h1>🎮 <span class="brand">GameRoom</span></h1>
            <p class="subtitle">Play real-time games with friends or strangers</p>
        </header>

        <section class="actions">
            <router-link to="/login">
                <el-button type="primary" size="large">Login</el-button>
            </router-link>
            <router-link to="/register">
                <el-button type="success" size="large">Register</el-button>
            </router-link>
            <el-button type="warning" size="large" @click="playAsGuest">Play as Guest</el-button>
        </section>
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
    padding: 80px 40px;
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    background: var(--page-background);
    color: var(--text-color);
}

:root {
    --page-background: linear-gradient(to bottom right, #f3f4f6, #ffffff);
    --text-color: #333;
}

body.dark {
    --page-background: #121212;
    --text-color: #e0e0e0;
}

header {
    text-align: center;
    margin-bottom: 40px;
}

h1 {
    font-size: 3rem;
    margin: 0;
}

.brand {
    color: #409eff;
}

body.dark {
    background-color: #1e1e1e;
    color: #e0e0e0;
}

.subtitle {
    font-size: 1.25rem;
    color: #666;
    margin-top: 10px;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
    margin-top: 40px;
}

.actions el-button {
    min-width: 160px;
}
</style>
