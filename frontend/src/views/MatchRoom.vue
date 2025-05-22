<template>
    <div class="match-room">
        <h2>🕹️ Match Started!</h2>
        <div class="vs-box">
            <span class="player">{{ player1 }}</span>
            <span class="vs">VS</span>
            <span class="player">{{ player2 }}</span>
        </div>
        <TicTacToe :room="room" :socket="socket" />
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

const route = useRoute()
const room = route.params.room as string
const game = route.query.game as string
const player1 = route.query.p1 as string
const player2 = route.query.p2 as string

const router = useRouter()

onMounted(() => {
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
})

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
</style>
