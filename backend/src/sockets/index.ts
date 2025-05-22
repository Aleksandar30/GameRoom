import { Server } from "socket.io"

const gameLobbies: Record<string, string[]> = {}
const ongoingMatches: Record<string, [string, string]> = {}
const socketToUsername: Record<string, string> = {}
const matchQueue: Record<string, string[]> = {}
import { setupTicTacToe } from './games/tictactoe'




export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log(`🟢 ${socket.id} connected`)

    setupTicTacToe(socket, io, socketToUsername)


    // ✅ Join shared game lobby
    socket.on("joinGameLobby", ({ game, username }) => {
      socket.join(`lobby-${game}`)
      socketToUsername[socket.id] = username

      if (!gameLobbies[game]) {
        gameLobbies[game] = []
      }

      if (!gameLobbies[game].includes(socket.id)) {
        gameLobbies[game].push(socket.id)
      }

      io.to(`lobby-${game}`).emit("lobbyChat", {
        user: username,
        message: "joined the lobby"
      })
    })

    socket.on("leaveLobby", ({ game, username }) => {
      socket.leave(`lobby-${game}`)

      if (gameLobbies[game]) {
        gameLobbies[game] = gameLobbies[game].filter(id => id !== socket.id)
      }

      io.to(`lobby-${game}`).emit("lobbyChat", {
        user: "System",
        message: `${username} left the lobby`
      })
    })



    // ✅ Lobby chat
    socket.on("chat:lobby", ({ game, message }) => {
      const username = socketToUsername[socket.id] || "Unknown"
      io.to(`lobby-${game}`).emit("lobbyChat", {
        user: username,
        message
      })
    })

    // ✅ Matchmaking logic
    socket.on("findMatch", (game: string) => {
      if (!matchQueue[game]) matchQueue[game] = []

      // Prevent duplicates
      if (!matchQueue[game].includes(socket.id)) {
        matchQueue[game].push(socket.id)
      }

      // Only match if 2+ players are waiting
      if (matchQueue[game].length >= 2) {
        const [player1, player2] = matchQueue[game].splice(0, 2)

        const matchRoom = `match-${player1}-${player2}`
        ongoingMatches[matchRoom] = [player1, player2]

        io.sockets.sockets.get(player1)?.join(matchRoom)
        io.sockets.sockets.get(player2)?.join(matchRoom)

        io.to(matchRoom).emit("matchFound", {
          room: matchRoom,
          players: [
            { id: player1, username: socketToUsername[player1] || "Guest" },
            { id: player2, username: socketToUsername[player2] || "Guest" }
          ]
        })

        console.log(`✅ Match created between ${player1} and ${player2}`)
      } else {
        socket.emit("lobbyChat", {
          user: "System",
          message: "Waiting for an opponent..."
        })
      }
    })

    socket.on("leaveMatch", ({ room }) => {
      socket.leave(room)

      const players = ongoingMatches[room]
      if (players) {
        const otherPlayer = players.find(id => id !== socket.id)
        if (otherPlayer) {
          io.to(otherPlayer).emit("matchEnded", {
            reason: "Your opponent has left the game."
          })
        }
      }

      delete ongoingMatches[room]
    })

    socket.on("cancelMatch", (game: string) => {
      if (matchQueue[game]) {
        matchQueue[game] = matchQueue[game].filter(id => id !== socket.id)
        socket.emit("lobbyChat", {
          user: "System",
          message: "You left the matchmaking queue."
        })
      }
    })

    // ✅ Chat inside private match
    socket.on("chat:private", ({ room, message }) => {
      io.to(room).emit("chat:private", {
        userId: socket.id,
        message,
      })
    })

    // ✅ Game move (like Tic Tac Toe)
    socket.on("tictactoe-move", ({ room, index, player }) => {
      io.to(room).emit("tictactoe-move", { index, player })
    })

    socket.on("tictactoe-reset", ({ room }) => {
      io.to(room).emit("tictactoe-reset")
    })

    // ✅ Handle disconnect
    socket.on("disconnect", () => {
      console.log(`🔴 ${socket.id} disconnected`)

      for (const game in gameLobbies) {
        gameLobbies[game] = gameLobbies[game].filter((id) => id !== socket.id)
        io.to(`lobby-${game}`).emit("lobbyChat", {
          user: "System",
          message: `${socket.id} left the lobby`,
        })
      }

      for (const room in ongoingMatches) {
        const players = ongoingMatches[room]
        if (players.includes(socket.id)) {
          io.to(room).emit("chat:private", {
            userId: "System",
            message: `${socket.id} disconnected from the match.`,
          })
          delete ongoingMatches[room]
        }
      }

      for (const room in ongoingMatches) {
        const players = ongoingMatches[room]
        if (players.includes(socket.id)) {
          const otherPlayer = players.find(id => id !== socket.id)
          if (otherPlayer) {
            io.to(otherPlayer).emit("matchEnded", {
              reason: "Your opponent disconnected."
            })
          }
          delete ongoingMatches[room]
        }
      }
      for (const game in matchQueue) {
        matchQueue[game] = matchQueue[game].filter(id => id !== socket.id)
      }
      delete socketToUsername[socket.id]
    })
  })
}
