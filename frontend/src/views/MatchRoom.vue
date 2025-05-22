<template>
    <div class="match-room">
        <h2>🕹️ Match Started!</h2>
        <p>Match ID: {{ room }}</p>


        <!-- <TicTacToe :room="room" :socket="socket" /> -->
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

const route = useRoute()
const room = route.params.room as string
const game = route.query.game as string

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
</style>
