<template>
    <div class="quiz-container">
        <h2 class="quiz-title">🧠 Quiz Battle</h2>

        <div v-if="question">
            <p class="question-text">{{ question }}</p>

            <div class="options">
                <el-button v-for="(text, key) in options" :key="key" :disabled="!canAnswer || hasAnswered"
                    @click="submitAnswer(key)" class="option-btn">
                    {{ key }}. {{ text }}
                </el-button>
            </div>
        </div>

        <el-button v-if="!hasAnswered && !canAnswer" type="primary" @click="applyToAnswer" :disabled="applied">
            🙋 Apply to Answer
        </el-button>

        <p v-if="lockedBy && !canAnswer">🔒 {{ lockedBy }} is answering...</p>
        <p v-if="result">✅ {{ result }}</p>

        <el-divider />

        <div class="scoreboard">
            <h4>🏆 Scoreboard</h4>
            <ul>
                <li v-for="(s, name) in scores" :key="name">
                    {{ name }}: {{ s }} pts
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Socket } from 'socket.io-client'

const props = defineProps<{ socket: Socket; room: string; username: string }>()

const question = ref('')
const options = ref<Record<string, string>>({})
const canAnswer = ref(false)
const hasAnswered = ref(false)
const applied = ref(false)
const lockedBy = ref('')
const result = ref('')
const scores = ref<Record<string, number>>({})

onMounted(() => {
    props.socket.emit('quiz-join', { room: props.room, username: props.username })

    props.socket.on('quiz-question', (payload) => {
        question.value = payload.question
        options.value = payload.options
        canAnswer.value = false
        hasAnswered.value = false
        applied.value = false
        lockedBy.value = ''
        result.value = ''
    })

    props.socket.on('quiz-scores', ({ scores: newScores }) => {
        scores.value = newScores
    })

    props.socket.on('quiz-locked', ({ username }) => {
        lockedBy.value = username
    })

    props.socket.on('quiz-your-turn', (payload) => {
        canAnswer.value = true
    })

    props.socket.on('quiz-answer-result', ({ correct, player, correctAnswer }) => {
        result.value = `${player} answered ${correct ? 'correctly' : `wrongly (correct was ${correctAnswer})`}`
        canAnswer.value = false
        hasAnswered.value = true
    })

    props.socket.on('quiz-end', ({ scores: finalScores }) => {
        result.value = '🏁 Game Over!'
        scores.value = finalScores.reduce((acc: Record<string, number>, player: { username: string, score: number }) => {
            acc[player.username] = player.score
            return acc
        }, {})
        canAnswer.value = false
        hasAnswered.value = true
    })
})

function applyToAnswer() {
    props.socket.emit('quiz-apply', { room: props.room })
    applied.value = true
}

function submitAnswer(key: string) {
    props.socket.emit('quiz-answer', { room: props.room, answer: key })
}
</script>

<style scoped>
.quiz-container {
    max-width: 600px;
    margin: 30px auto;
    padding: 24px;
    background: var(--el-bg-color-overlay);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    text-align: center;
}

.quiz-title {
    font-size: 24px;
    margin-bottom: 20px;
}

.question-text {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
}

.options {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
}

.option-btn {
    width: 100%;
}

.scoreboard {
    text-align: left;
    margin-top: 20px;
}
</style>
