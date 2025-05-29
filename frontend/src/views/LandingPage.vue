<template>
    <div class="wrapper">
        <div class="landing">
            <header>
                <h1>🎮 <span class="brand">GameRoom</span></h1>
                <p class="subtitle">Play real-time games with friends or strangers</p>
                <el-button size="large" @click="toggleDark()" class="theme-toggle" plain>
                    {{ isDark ? '🌙 Dark Mode' : '☀️ Light Mode' }}
                </el-button>
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
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'

const router = useRouter()

function playAsGuest() {
    const guestId = 'Guest_' + Math.floor(Math.random() * 10000)
    sessionStorage.setItem('guestUser', guestId)
    router.push('/lobby')
}

const isDark = useDark({
    valueDark: 'dark',
    valueLight: 'light',
    selector: 'body',
    storageKey: 'theme',
})

const toggleDark = useToggle(isDark)
</script>

<style>
:root {
    --page-background: linear-gradient(to bottom right, #f3f4f6, #ffffff);
    --text-color: #333;
}

body.dark {
    --page-background: #121212;
    --text-color: #e0e0e0;
}

/* Centering wrapper */
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
    background: var(--page-background);
    padding: 20px;
    box-sizing: border-box;
}

/* Main box */
.landing {
    background: rgba(255, 255, 255, 0.9);
    color: var(--text-color);
    border: 2px solid #409eff;
    /* \U0001f4a1 customized border */
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 60px 40px;
    text-align: center;
    max-width: 600px;
    width: 100%;
    font-family: 'Segoe UI', sans-serif;
    box-sizing: border-box;
    transition: background 0.3s, border-color 0.3s;
}

body.dark .landing {
    background: rgba(18, 18, 18, 0.95);
    border-color: #66b1ff;
    /* \U0001f4a1 softer blue for dark mode */
}

header {
    margin-bottom: 40px;
}

h1 {
    font-size: 3.5rem;
    margin: 0;
}

.brand {
    color: #409eff;
}

.subtitle {
    font-size: 1.5rem;
    color: #666;
    margin-top: 12px;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
}

.actions el-button {
    min-width: 180px;
    font-size: 1.2rem;
}

.theme-toggle {
    margin-top: 24px;
    font-size: 1rem;
}
</style>
