<template>
  <div class="container">
    <LobbyForm v-if="!joined" @joined="onJoin" />
    <div v-else>
      <LobbyChat :socket="socket" :lobbyCode="lobbyCode" />
      <TicTacToe :socket="socket" :lobbyCode="lobbyCode" :playerSymbol="playerSymbol" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import LobbyForm from './components/LobbyForm.vue'
import LobbyChat from './components/LobbyChat.vue'
import TicTacToe from './components/TicTacToe.vue'


const socket = io('http://localhost:3000') // backend address
const joined = ref(false)
const lobbyCode = ref('')
const playerSymbol = ref<'X' | 'O' | null>(null)

function onJoin(code: string) {
  lobbyCode.value = code
  joined.value = true
  socket.emit('joinLobby', code)
  socket.on('assignSymbol', (symbol: 'X' | 'O') => {
    playerSymbol.value = symbol
  })
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
}
</style>
