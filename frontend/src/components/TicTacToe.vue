<template>
  <div class="game">
    <p>You are playing as <strong>{{ playerSymbol }}</strong></p>
    <p>Current Turn: {{ currentTurn }}</p>
    <div class="board">
      <div v-for="(cell, index) in board" :key="index" class="cell" @click="makeMove(index)"
        :class="{ x: cell === 'X', o: cell === 'O' }">
        {{ cell }}
      </div>
    </div>
    <p v-if="winner && winner !== 'Tie'">🎉 Winner: {{ usernames[winner as 'X' | 'O'] }}</p>
    <p v-else-if="winner === 'Tie'">🤝 It's a tie!</p>
    <button @click="resetGame">Reset Game</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Socket } from 'socket.io-client'

const props = defineProps<{
  socket: Socket
  room: string
}>()

const board = ref(Array(9).fill(''))
const currentTurn = ref<'X' | 'O'>('X') // default is X's turn
const winner = ref('')
const usernames = ref<{ X: string; O: string }>({ X: 'Player X', O: 'Player O' })


// 🧠 Win combinations
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
]

const playerSymbol = ref<'X' | 'O' | null>(null)

onMounted(() => {
  props.socket.emit('tictactoe-join', { room: props.room })

  props.socket.off('tictactoe-start')
  props.socket.off('tictactoe-move')
  props.socket.off('tictactoe-reset')

  props.socket.on('tictactoe-start', ({ symbol, currentTurn: turn, usernames: nameMap }) => {
    playerSymbol.value = symbol
    currentTurn.value = turn
    usernames.value = nameMap
  })

  props.socket.on('tictactoe-move', ({ index, player }) => {
    applyMove(index, player)
  })

  props.socket.on('tictactoe-reset', () => {
    board.value = Array(9).fill('')
    currentTurn.value = 'X'
    winner.value = ''
  })
})

function makeMove(index: number) {
  if (board.value[index] || winner.value) return
  if (playerSymbol.value !== currentTurn.value) return
  props.socket.emit('tictactoe-move', {
    room: props.room,
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
  props.socket.emit('tictactoe-reset', { room: props.room })
}

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

.cell.x {
  color: #f56c6c;
  /* red for X */
  font-weight: bold;
}

.cell.o {
  color: #67c23a;
  /* green for O */
  font-weight: bold;
}
</style>
