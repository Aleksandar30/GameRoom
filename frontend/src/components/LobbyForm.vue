<template>
  <div>
    <h2>Join a Lobby</h2>
    <input v-model="code" placeholder="Enter lobby code" />
    <button @click="join">Join</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const code = ref('')
const emit = defineEmits(['joined'])

function join() {
  if (code.value.trim()) {
    emit('joined', code.value.trim())
  }
}
</script>
