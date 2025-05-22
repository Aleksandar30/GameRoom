<template>
    <div class="match-room">
        <h2>🕹️ Match Started!</h2>
        <div class="vs-box">
            <span class="player">{{ player1 }}</span>
            <span class="vs">VS</span>
            <span class="player">{{ player2 }}</span>
        </div>
        <TicTacToe v-if="game === 'tictactoe'" :room="room" :socket="socket" />
        <Hangman v-else-if="game === 'hangman'" :room="room" :socket="socket" />

    </div>
    <div class="chat" ref="chatBox">
        <div v-for="(msg, index) in chatMessages" :key="index"
            :class="msg.user === username ? 'my-message' : 'other-message'">
            [{{ msg.time }}] <strong>{{ msg.user }}</strong>: {{ msg.text }}
        </div>
    </div>
    <div class="chat-input-row">
        <el-input v-model="newMessage" placeholder="Say something..." class="chat-input" @keyup.enter="sendMessage" />
        <el-button @click="sendMessage">Send</el-button>
    </div>
    <el-button type="danger" @click="endGame" class="end-button">
        🔚 End Game
    </el-button>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { socket } from '../socket'
import { onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import TicTacToe from '../components/TicTacToe.vue'
import Hangman from '../components/Hangman.vue'
import { ref, nextTick, onBeforeUnmount } from 'vue'

const chatMessages = ref<{ user: string; text: string; time: string }[]>([])
const newMessage = ref('')
const chatBox = ref<HTMLElement | null>(null)




const route = useRoute()
const room = route.params.room as string
const game = route.query.game as string
const player1 = route.query.p1 as string
const player2 = route.query.p2 as string
const username = player1 === (JSON.parse(sessionStorage.getItem('user') || '{}').username || '') ? player1 : player2

const router = useRouter()

onMounted(() => {
    socket.off("matchEnded")
    socket.on("matchEnded", ({ reason }) => {
        console.log("Match ended:", reason)
        ElMessageBox.alert(reason, 'Game Ended', {
            confirmButtonText: 'Back to Lobby',
            type: 'warning',
            callback: () => {
                router.push(`/room/${game}`)
            }
        })
    })

    socket.off("chat:private")
    socket.on("chat:private", ({ user, message }) => {
        chatMessages.value.push({
            user,
            text: message,
            time: getCurrentTime()
        })
        nextTick(() => {
            if (chatBox.value) {
                chatBox.value.scrollTop = chatBox.value.scrollHeight
            }
        })
    })
})


function getCurrentTime(): string {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onBeforeUnmount(() => {
    socket.off("matchEnded")
    socket.off("chat:private")
})


function sendMessage() {
    if (!newMessage.value.trim()) return
    socket.emit('chat:private', { room, message: newMessage.value })
    newMessage.value = ''
}

function endGame() {
    socket.emit('leaveMatch', { room })
    router.push(`/room/${game}`)
}
</script>

<style scoped>
.end-button {
    margin-top: 20px;
}

.vs-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    font-size: 1.5em;
    margin-top: 20px;
}

.player {
    font-weight: bold;
}

.vs {
    color: #f56c6c;
    font-weight: bold;
}

.chat {
    height: 250px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
    margin: 30px auto 10px;
    text-align: left;
    font-family: monospace;
    background: #000000;
    color: #fff;
    max-width: 600px;
    scroll-behavior: smooth;
}

.chat-input {
    flex: 1;
    margin: 0;
}

.chat-input-row {
    display: flex;
    gap: 8px;
    max-width: 600px;
    margin: 0 auto 30px;
}

.my-message {
    color: #409eff;
    font-weight: bold;
}

.other-message {
    color: #a09e9e;
}
</style>
