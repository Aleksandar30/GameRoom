<template>
    <div class="hangman">
        <h2 class="game-title">🪓 Hangman</h2>

        <div v-if="role === 'setter'" class="setter-panel">
            <p class="role-label">You're the <strong>Setter</strong></p>
            <div class="input-group">
                <el-input v-model="wordToSet" placeholder="Enter word to set" clearable />
                <el-button type="primary" @click="setWord" :disabled="!wordToSet.trim()">Set Word</el-button>
            </div>

        </div>


        <div v-else-if="role === 'guesser'" class="guesser-panel">
            <p class="role-label">You're the <strong>Guesser</strong></p>
            <div class="game-info">
                <p><strong>Word:</strong> <span class="revealed">{{ revealed.join(' ') }}</span></p>
                <p><strong>Guessed Letters:</strong> {{ guessed.join(', ') || '-' }}</p>
                <p><strong>Remaining Guesses:</strong> {{ remainingGuesses }}</p>
            </div>
            <el-input v-model="letter" maxlength="1" placeholder="Type a letter" @keyup.enter="guessLetter"
                :disabled="!wordSet || result" class="input-box" />
        </div>

        <pre class="hangman-drawing">{{ hangmanDrawing }}</pre>

        <el-button type="success" v-if="result" @click="playAgain" class="play-again-btn">
            🔁 Play Again
        </el-button>

        <p v-if="result" class="result-message">
            🏁 {{ result === 'guesser' ? 'Guesser wins!' : `Setter wins! The word was: ${revealed.join('')}` }}
        </p>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
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

function playAgain() {
    console.log('Play again')
    props.socket.emit('hangman-reset', { room: props.room })
}

const hangmanStages = [
    '',
    'O',
    'O\n|',
    'O\n/|',
    'O\n/|\\',
    'O\n/|\\\n/',
    'O\n/|\\\n/ \\'
]

const hangmanDrawing = computed(() => hangmanStages[6 - remainingGuesses.value])


onMounted(() => {
    props.socket.off('hangman-role')
    props.socket.off('hangman-start')
    props.socket.off('hangman-update')
    props.socket.off('hangman-end')
    props.socket.off('hangman-reset')

    props.socket.emit('hangman-join', { room: props.room })

    props.socket.on('hangman-role', ({ role: r }) => {
        role.value = r
        wordToSet.value = ''
        guessed.value = []
        revealed.value = []
        remainingGuesses.value = 6
        letter.value = ''
        result.value = null
        wordSet.value = false
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

    props.socket.on('hangman-reset', () => {
        wordToSet.value = ''
        guessed.value = []
        revealed.value = []
        remainingGuesses.value = 6
        letter.value = ''
        result.value = null
        wordSet.value = false
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

<style scoped>
.hangman {
    max-width: 600px;
    margin: 0 auto;
    padding: 30px 20px;
    text-align: center;
    background-color: var(--el-bg-color-overlay, #fff);
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}

.game-title {
    font-size: 28px;
    margin-bottom: 24px;
    color: var(--el-text-color-primary);
}

.role-label {
    font-size: 16px;
    margin-bottom: 12px;
    color: var(--el-text-color-secondary);
}

.input-group {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

.input-box {
    margin-bottom: 16px;
    width: 100%;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
}

.hangman-drawing {
    font-family: monospace;
    font-size: 20px;
    line-height: 24px;
    margin: 20px auto;
    white-space: pre;
    color: var(--el-color-danger);
}

.guesser-panel .game-info {
    text-align: left;
    max-width: 400px;
    margin: 0 auto 20px;
    font-size: 15px;
    line-height: 1.5;
}

.revealed {
    font-family: monospace;
    letter-spacing: 4px;
    font-size: 18px;
    font-weight: bold;
}

.result-message {
    font-weight: bold;
    margin-top: 10px;
    color: var(--el-color-success);
}

.play-again-btn {
    margin-top: 20px;
}
</style>
