<template>
    <div class="lobby">
        <h2>🎮 Game Lobby</h2>

        <el-button type="danger" plain @click="logout">
            🔓 Logout
        </el-button>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('guestUser')
    router.push('/')
}
</script>

<style scoped>
.lobby {
    text-align: center;
    margin-top: 100px;
}

.el-button {
    margin-top: 20px;
}
</style>
