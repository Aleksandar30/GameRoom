<template>
    <div class="game-hub">
        <h2 class="title">🎮 Choose a Game</h2>

        <div class="game-grid">
            <el-card class="game-card" shadow="hover" @click="goToRoom('tictactoe')">
                <div class="card-content">
                    <h3>Tic Tac Toe</h3>
                    <p>Challenge a friend to a classic game</p>
                </div>
            </el-card>

            <el-card class="game-card" shadow="hover" @click="goToRoom('hangman')">
                <div class="card-content">
                    <h3>Hangman</h3>
                    <p>Guess the word before it’s too late</p>
                </div>
            </el-card>
            <el-card class="game-card" shadow="hover" @click="goToRoom('quiz')">
                <div class="card-content">
                    <h3>Quiz</h3>
                    <p>Test your knoweladge agains live opponents</p>
                </div>
            </el-card>
        </div>

        <el-button type="danger" plain @click="logout" class="logout-btn">
            🔓 Logout
        </el-button>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToRoom(game: string) {
    router.push(`/room/${game}`)
}

function logout() {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('guestUser')
    router.push('/')
}
</script>

<style scoped>
.game-hub {
    padding: 60px 20px;
    text-align: center;
    background: var(--el-bg-color-page);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 40px;
    color: var(--el-text-color-primary);
}

.game-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 30px;
    width: 100%;
    max-width: 960px;
}

.game-card {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-radius: 16px;
    overflow: hidden;
    padding: 10px;
}

.game-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card-content {
    padding: 20px;
}

.card-content h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: var(--el-text-color-primary);
}

.card-content p {
    font-size: 14px;
    color: var(--el-text-color-secondary);
}

.logout-btn {
    margin-top: 50px;
    font-size: 16px;
    padding: 10px 30px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
}
</style>
