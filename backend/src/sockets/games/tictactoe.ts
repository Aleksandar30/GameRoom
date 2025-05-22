// backend/src/sockets/games/tictactoe.ts
import { Server, Socket } from 'socket.io'

export function setupTicTacToe(socket: Socket, io: Server, socketToUsername: Record<string, string>) {
    socket.on('tictactoe-join', ({ room }) => {
        socket.join(room)

        const clients = Array.from(io.sockets.adapter.rooms.get(room) || [])

        if (clients.length === 2) {
            const [player1, player2] = clients
            const random = Math.random() < 0.5

            const symbol1 = random ? 'X' : 'O'
            const symbol2 = random ? 'O' : 'X'

            io.to(player1).emit('tictactoe-start', {
                symbol: symbol1,
                currentTurn: 'X',
                opponent: player2,
                usernames: {
                    X: socketToUsername[random ? player1 : player2],
                    O: socketToUsername[random ? player2 : player1],
                }
            })

            io.to(player2).emit('tictactoe-start', {
                symbol: symbol2,
                currentTurn: 'X',
                opponent: player1,
                usernames: {
                    X: socketToUsername[random ? player1 : player2],
                    O: socketToUsername[random ? player2 : player1],
                }
            })
        }
    })

    socket.on('tictactoe-move', ({ room, index, player }) => {
        io.to(room).emit('tictactoe-move', { index, player })
    })

    socket.on('tictactoe-reset', ({ room }) => {
        io.to(room).emit('tictactoe-reset')
    })
}
