<template>
    <div class="hangman">
        <h3>Hangman</h3>
        <div v-if="role === 'setter'">
            <el-input v-model="wordToSet" placeholder="Enter word" />
            <el-button @click="setWord">Set Word</el-button>
        </div>

        <div v-else-if="role === 'guesser'">
            <p>Word: {{ revealed.join(' ') }}</p>
            <p>Guessed: {{ guessed.join(', ') }}</p>
            <p>Remaining Guesses: {{ remainingGuesses }}</p>
            <el-input v-model="letter" maxlength="1" placeholder="Guess letter" @keyup.enter="guessLetter" />
        </div>

        <p v-if="result">🏁 {{ result === 'guesser' ? 'Guesser wins!' : `Setter wins! The word was:
            ${revealed.join('')}` }}</p>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Socket } from 'socket.io-client'

const props = defineProps<{ socket: Socket, room: string }>()

const role = ref<'setter' | 'guesser' | null>(null)
const wordToSet = ref('')
const guessed = ref<string[]>([])
const revealed = ref<string[]>([])
const remainingGuesses = ref(6)
const letter = ref('')
const result = ref<string | null>(null)
const wordSet = ref(false)


onMounted(() => {
    props.socket.emit('hangman-join', { room: props.room })

    props.socket.on('hangman-role', ({ role: r }) => {
        role.value = r
    })

    props.socket.on('hangman-start', ({ guessed: g, remainingGuesses: r, revealed: rWord }) => {
        guessed.value = g
        remainingGuesses.value = r
        revealed.value = rWord
        wordSet.value = true
    })

    props.socket.on('hangman-update', ({ guessed: g, revealed: r, remainingGuesses: rem }) => {
        guessed.value = g
        revealed.value = r
        remainingGuesses.value = rem
    })

    props.socket.on('hangman-end', ({ result: res, word }) => {
        result.value = res
        if (res === 'setter' && word) {
            revealed.value = word.split('')
        }
    })
})

function setWord() {
    if (wordToSet.value.trim()) {
        props.socket.emit('hangman-set-word', { room: props.room, word: wordToSet.value })
    }
}

function guessLetter() {
    if (letter.value && !guessed.value.includes(letter.value)) {
        props.socket.emit('hangman-guess', { room: props.room, letter: letter.value.toLowerCase() })
        letter.value = ''
    }
}
</script>
