import { Server } from "socket.io"

const gameLobbies: Record<string, string[]> = {}
const ongoingMatches: Record<string, [string, string]> = {}

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log(`🟢 ${socket.id} connected`)

    // ✅ Join shared game lobby
    socket.on("joinGameLobby", (game: string) => {
      socket.join(`lobby-${game}`)
      if (!gameLobbies[game]) gameLobbies[game] = []
      if (!gameLobbies[game].includes(socket.id)) {
        gameLobbies[game].push(socket.id)
      }

      io.to(`lobby-${game}`).emit("lobbyChat", {
        userId: socket.id,
        message: "joined the lobby",
      })
    })

    // ✅ Lobby chat
    socket.on("chat:lobby", ({ game, message }) => {
      io.to(`lobby-${game}`).emit("lobbyChat", {
        userId: socket.id,
        message,
      })
    })

    // ✅ Matchmaking logic
    socket.on("findMatch", (game: string) => {
      const players = gameLobbies[game] || []
      const opponent = players.find((id) => id !== socket.id)

      if (opponent) {
        const matchRoom = `match-${socket.id}-${opponent}`

        // Save and join match room
        ongoingMatches[matchRoom] = [socket.id, opponent]
        socket.join(matchRoom)
        io.sockets.sockets.get(opponent)?.join(matchRoom)

        // Notify both players
        io.to(matchRoom).emit("matchFound", {
          room: matchRoom,
          players: [socket.id, opponent],
        })

        // Remove matched players from lobby
        gameLobbies[game] = players.filter((id) => id !== socket.id && id !== opponent)
      } else {
        socket.emit("lobbyChat", {
          userId: "System",
          message: "Waiting for an opponent...",
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
          userId: "System",
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
    })
  })
}
