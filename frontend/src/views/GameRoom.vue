<template>
    <div class="lobby">
        <h2>{{ gameTitle }} Lobby</h2>

        <div class="chat">
            <div v-for="(msg, i) in messages" :key="i">{{ msg }}</div>
        </div>

        <el-input v-model="newMessage" placeholder="Say something..." @keyup.enter="sendMessage" class="chat-input" />
        <el-button @click="sendMessage">Send</el-button>

        <el-divider />

        <el-button type="primary" @click="findMatch">
            🎯 Find Match
        </el-button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { io, Socket } from 'socket.io-client'

const route = useRoute()
const router = useRouter()

const game = route.params.game as string
const gameTitle = game.charAt(0).toUpperCase() + game.slice(1)

const socket: Socket = io('http://localhost:3000')

const messages = ref<string[]>([])
const newMessage = ref('')

onMounted(() => {
    socket.emit('joinGameLobby', game)

    socket.on('lobbyChat', ({ userId, message }) => {
        messages.value.push(`💬 ${userId}: ${message}`)
    })

    socket.on('matchFound', ({ room }) => {
        router.push(`/match/${room}`)
    })
})

function sendMessage() {
    if (!newMessage.value.trim()) return
    socket.emit('chat:lobby', { game, message: newMessage.value })
    newMessage.value = ''
}

function findMatch() {
    socket.emit('findMatch', game)
}
</script>

<style scoped>
.lobby {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    text-align: center;
}

.chat {
    height: 250px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
}

.chat-input {
    width: 100%;
    margin: 10px 0;
}
</style>
