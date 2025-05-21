<template>
    <div class="game-hub">
        <h2>🎮 Choose a Game</h2>

        <div class="game-grid">
            <el-card class="game-card" shadow="hover" @click="goToRoom('tictactoe')">
                <h3>Tic Tac Toe</h3>
                <p>Challenge a friend to a classic game</p>
            </el-card>

            <el-card class="game-card" shadow="hover" @click="goToRoom('hangman')">
                <h3>Hangman</h3>
                <p>Guess the word before it’s too late</p>
            </el-card>

            <!-- More games here later -->
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
    padding: 40px;
    text-align: center;
}

.game-grid {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    margin: 40px auto;
    max-width: 800px;
}

.game-card {
    width: 220px;
    cursor: pointer;
    transition: transform 0.2s;
}

.game-card:hover {
    transform: translateY(-5px);
}

.logout-btn {
    margin-top: 40px;
}
</style>
