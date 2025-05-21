<template>
  <div class="game">
    <h3>Tic Tac Toe – Lobby: {{ lobbyCode }}</h3>
    <p>Current Turn: {{ currentTurn }}</p>
    <div class="board">
      <div v-for="(cell, index) in board" :key="index" class="cell" @click="makeMove(index)">
        {{ cell }}
      </div>
    </div>
    <p v-if="winner">🎉 Winner: {{ winner }}</p>
    <button @click="resetGame">Reset Game</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Socket } from 'socket.io-client'

const props = defineProps<{
  socket: Socket
  lobbyCode: string
  playerSymbol: 'X' | 'O' | null
}>()

const board = ref(Array(9).fill(''))
const currentTurn = ref<'X' | 'O'>('X') // default is X's turn
const winner = ref('')

// 🧠 Win combinations
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
]

function makeMove(index: number) {
  if (board.value[index] || winner.value) return
  if (props.playerSymbol !== currentTurn.value) return // 🛑 Not your turn
  props.socket.emit('tictactoe-move', {
    lobbyCode: props.lobbyCode,
    index,
    player: currentTurn.value
  })
}
function applyMove(index: number, player: string) {
  board.value[index] = player
  checkWinner()
  currentTurn.value = player === 'X' ? 'O' : 'X'
}

function checkWinner() {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern
    if (
      board.value[a] &&
      board.value[a] === board.value[b] &&
      board.value[a] === board.value[c]
    ) {
      winner.value = board.value[a]
      return
    }
  }
  if (!board.value.includes('')) {
    winner.value = 'Tie'
  }
}

function resetGame() {
  board.value = Array(9).fill('')
  currentTurn.value = 'X'
  winner.value = ''
  props.socket.emit('tictactoe-reset', { lobbyCode: props.lobbyCode })
}

onMounted(() => {
  props.socket.on('tictactoe-move', ({ index, player }) => {
    applyMove(index, player)
  })

  props.socket.on('tictactoe-reset', () => {
    board.value = Array(9).fill('')
    currentTurn.value = 'X'
    winner.value = ''
  })
})
</script>

<style scoped>
.game {
  text-align: center;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 80px);
  gap: 10px;
  justify-content: center;
  margin: 20px auto;
}

.cell {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  font-size: 2em;
  line-height: 80px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #ccc;
}
</style>
