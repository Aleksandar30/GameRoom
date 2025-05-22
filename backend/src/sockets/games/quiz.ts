import { Server, Socket } from 'socket.io'
import { Question } from '../../entities/Question'
import { AppDataSource } from '../../data-source'


type QuizPlayer = {
    socketId: string
    username: string
    score: number
}

type QuizGameState = {
    players: QuizPlayer[]
    currentQuestion: Question | null
    room: string
    applied: string[] // socket IDs
    answeringPlayer: string | null
    round: number
    timer?: NodeJS.Timeout
}

const quizRooms: Record<string, QuizGameState> = {}

export function setupQuiz(socket: Socket, io: Server) {
    socket.on('quiz-join', async ({ room, username }) => {
        socket.join(room)

        if (!quizRooms[room]) {
            quizRooms[room] = {
                players: [],
                currentQuestion: null,
                room,
                applied: [],
                answeringPlayer: null,
                round: 0
            }
        }

        const game = quizRooms[room]
        game.players.push({ socketId: socket.id, username, score: 0 })

        // Start game when 2 players join
        if (game.players.length === 2) {
            sendNextQuestion(game, io)
        }
        io.to(room).emit('quiz-scores', {
            scores: game.players.reduce((acc, p) => {
                acc[p.username] = p.score
                return acc
            }, {} as Record<string, number>)
        })
    })

    socket.on('quiz-apply', ({ room }) => {
        const game = quizRooms[room]
        if (!game || game.answeringPlayer) return
        if (!game.applied.includes(socket.id)) {
            game.applied.push(socket.id)

            if (game.applied.length === 1) {
                game.answeringPlayer = socket.id
                io.to(socket.id).emit('quiz-your-turn', game.currentQuestion)
                io.to(room).emit('quiz-locked', { username: getUsername(game, socket.id) })
            }
        }
    })

    socket.on('quiz-answer', ({ room, answer }) => {
        const game = quizRooms[room]
        if (!game || socket.id !== game.answeringPlayer) return

        const isCorrect = answer === game.currentQuestion?.correctOption
        const player = game.players.find(p => p.socketId === socket.id)

        if (player) {
            player.score += isCorrect ? 10 : -5
        }

        io.to(room).emit('quiz-answer-result', {
            correct: isCorrect,
            player: getUsername(game, socket.id),
            correctAnswer: game.currentQuestion?.correctOption
        })

        // ✅ emit updated scores
        io.to(room).emit('quiz-scores', {
            scores: game.players.reduce((acc, p) => {
                acc[p.username] = p.score
                return acc
            }, {} as Record<string, number>)
        })

        setTimeout(() => sendNextQuestion(game, io), 2000)
    })

}


async function sendNextQuestion(game: QuizGameState, io: Server) {
    // ✅ End game after 5 rounds
    if (game.round >= 5) {
        io.to(game.room).emit('quiz-end', {
            scores: game.players.map(p => ({
                username: p.username,
                score: p.score
            }))
        })
        delete quizRooms[game.room] // Optional: cleanup memory
        return
    }

    const repo = AppDataSource.getRepository(Question)
    const all = await repo.find()
    const random = all[Math.floor(Math.random() * all.length)]

    game.currentQuestion = random
    game.applied = []
    game.answeringPlayer = null
    game.round += 1

    io.to(game.room).emit('quiz-question', {
        question: random.question,
        options: {
            A: random.optionA,
            B: random.optionB,
            C: random.optionC,
            D: random.optionD
        }
    })


    // Optionally: Set a 10s timeout here for applying

}

function getUsername(game: QuizGameState, socketId: string): string {
    const player = game.players.find(p => p.socketId === socketId)
    return player?.username || "Unknown"
}

