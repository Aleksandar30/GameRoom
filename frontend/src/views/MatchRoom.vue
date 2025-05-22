<template>
    <div class="match-room">
        <h2>🕹️ Match Started!</h2>
        <p>Match ID: {{ room }}</p>


        <!-- <TicTacToe :room="room" :socket="socket" /> -->
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
// import { socket } from '../socket'
// import TicTacToe from '../components/TicTacToe.vue'

const route = useRoute()
const room = route.params.room as string
</script>
