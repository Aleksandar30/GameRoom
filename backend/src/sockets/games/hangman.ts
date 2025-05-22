import { Server, Socket } from 'socket.io'

const hangmanRooms: Record<string, {
    word: string
    guessed: string[]
    remainingGuesses: number
    players: string[]
    turn: string // socket.id of the guessing player
    isWordSet: boolean
}> = {}

export function setupHangman(socket: Socket, io: Server) {
    socket.on('hangman-join', ({ room }) => {
        socket.join(room)
        const clients = Array.from(io.sockets.adapter.rooms.get(room) || [])

        if (clients.length === 2) {
            const [setter, guesser] = clients
            hangmanRooms[room] = {
                word: '',
                guessed: [],
                remainingGuesses: 6,
                players: [setter, guesser],
                turn: guesser,
                isWordSet: false
            }

            io.to(setter).emit('hangman-role', { role: 'setter' })
            io.to(guesser).emit('hangman-role', { role: 'guesser' })
        }
    })

    socket.on('hangman-set-word', ({ room, word }) => {
        const game = hangmanRooms[room]
        if (game) {
            game.word = word.toLowerCase()
            game.isWordSet = true

            const revealed = word.split('').map(() => '_')

            io.to(room).emit('hangman-start', {
                guessed: [],
                remainingGuesses: 6,
                revealed
            })
        }
    })

    socket.on('hangman-guess', ({ room, letter }) => {
        const game = hangmanRooms[room]
        if (!game || !game.isWordSet || game.remainingGuesses <= 0 || game.guessed.includes(letter)) return

        game.guessed.push(letter)
        if (!game.word.includes(letter)) {
            game.remainingGuesses--
        }

        const revealed = game.word.split('').map(l => game.guessed.includes(l) ? l : '_')

        io.to(room).emit('hangman-update', {
            guessed: game.guessed,
            remainingGuesses: game.remainingGuesses,
            revealed
        })

        if (!revealed.includes('_')) {
            io.to(room).emit('hangman-end', { result: 'guesser' })
            delete hangmanRooms[room]
        } else if (game.remainingGuesses === 0) {
            io.to(room).emit('hangman-end', { result: 'setter', word: game.word })
            delete hangmanRooms[room]
        }
    })


    socket.on('hangman-reset', ({ room }) => {
        delete hangmanRooms[room]
        io.to(room).emit('hangman-reset')
    })
}
