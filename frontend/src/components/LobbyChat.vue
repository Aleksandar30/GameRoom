<template>
  <div>
    <h3>Lobby: {{ lobbyCode }}</h3>
    <div class="chat">
      <div v-for="(msg, i) in messages" :key="i">{{ msg }}</div>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Say something..." />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Socket } from 'socket.io-client'

// ✅ Proper props declaration
const props = defineProps<{
  socket: Socket
  lobbyCode: string
}>()

const messages = ref<string[]>([])
const newMessage = ref('')

onMounted(() => {
  props.socket.on('userJoined', (id: string) => {
    messages.value.push(`👤 User ${id} joined the lobby`)
  })

  props.socket.on('chat', (data: { userId: string; message: string }) => {
    messages.value.push(`💬 ${data.userId}: ${data.message}`)
  })
})

function sendMessage() {
  if (newMessage.value.trim()) {
    props.socket.emit('chat', { lobbyCode: props.lobbyCode, message: newMessage.value })
    newMessage.value = ''
  }
}
</script>

<style scoped>
.chat {
  border: 1px solid #ccc;
  height: 200px;
  padding: 10px;
  overflow-y: auto;
  margin-bottom: 10px;
}
</style>
