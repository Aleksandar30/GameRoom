<template>
    <div class="lobby">
        <h2>{{ gameTitle }} Lobby</h2>

        <div class="chat" ref="chatBox">
            <div v-for="(msg, i) in messages" :key="i" :class="msg.user === username ? 'my-message' : 'other-message'">
                [{{ msg.time }}] <strong>{{ msg.user }}</strong>: {{ msg.message }}
            </div>
        </div>
        <div class="chat-input-row">
            <el-input v-model="newMessage" placeholder="Say something..." class="chat-input"
                @keyup.enter="sendMessage" />
            <el-button @click="sendMessage">Send</el-button>
        </div>

        <el-divider />

        <el-button :type="isMatching ? 'danger' : 'primary'" @click="isMatching ? cancelMatch() : findMatch()">
            {{ isMatching ? '❌ Cancel Match' : '🎯 Find Match' }}
        </el-button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const chatBox = ref<HTMLElement | null>(null)


const game = route.params.game as string
const gameTitle = game.charAt(0).toUpperCase() + game.slice(1)

const user = JSON.parse(sessionStorage.getItem('user') || '{}')
const username = user.username || `Guest${Math.floor(Math.random() * 1_000_000)}`
const isMatching = ref(false)


import { socket } from '../socket'


const messages = ref<{ time: string; user: string; message: string }[]>([])
const newMessage = ref('')

onMounted(() => {
    socket.emit('joinGameLobby', { game, username })

    socket.off('lobbyChat')

    socket.on('lobbyChat', (data: { user: string; message: string }) => {
        messages.value.push({
            time: getCurrentTime(),
            user: data.user || '???',
            message: data.message
        })

        nextTick(() => {
            if (chatBox.value) {
                chatBox.value.scrollTop = chatBox.value.scrollHeight
            }
        })
    })

    socket.on('matchFound', ({ room }) => {
        console.log('✅ Match found, navigating to room:', room)
        isMatching.value = false

        router.push(`/match/${room}`)
    })


})



function getCurrentTime(): string {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function sendMessage() {
    if (!newMessage.value.trim()) return
    socket.emit('chat:lobby', { game, message: newMessage.value })
    newMessage.value = ''
}

function findMatch() {
    if (!isMatching.value) {
        console.log('🔍 Searching for a match...')
        isMatching.value = true
        socket.emit('findMatch', game)
    }
}

function cancelMatch() {
    console.log('❌ Cancelling matchmaking...')
    isMatching.value = false
    socket.emit('cancelMatch', game)
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
    text-align: left;
    font-family: monospace;
    scroll-behavior: smooth;
}

.chat-input {
    flex: 1;
    margin: 0;
}

.my-message {
    color: #409eff;
    /* Element Plus primary blue */
    font-weight: bold;
}

.other-message {
    color: #a09e9e;
}

.chat-input-row {
    display: flex;
    gap: 8px;
    margin-top: 0;
}
</style>
