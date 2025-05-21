import { Server } from "socket.io"

// 🧠 Keeps track of players in each lobby
const lobbyPlayers: Record<string, string[]> = {}

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log(`🟢 ${socket.id} connected`)

    socket.on("joinLobby", (lobbyCode: string) => {
      socket.join(lobbyCode)
      console.log(`${socket.id} joined ${lobbyCode}`)

      // Initialize the lobby if it's new
      if (!lobbyPlayers[lobbyCode]) {
        lobbyPlayers[lobbyCode] = []
      }

      // Add player if not already in the lobby
      if (!lobbyPlayers[lobbyCode].includes(socket.id)) {
        lobbyPlayers[lobbyCode].push(socket.id)
      }

      // Assign symbol: first = 'X', second = 'O'
      const playerIndex = lobbyPlayers[lobbyCode].indexOf(socket.id)
      const symbol = playerIndex === 0 ? 'X' : 'O'

      socket.emit("assignSymbol", symbol)

      io.to(lobbyCode).emit("userJoined", socket.id)
    })

    socket.on("chat", ({ lobbyCode, message }) => {
      io.to(lobbyCode).emit("chat", { userId: socket.id, message })
    })

    socket.on("tictactoe-move", ({ lobbyCode, index, player }) => {
      io.to(lobbyCode).emit("tictactoe-move", { index, player })
    })

    socket.on("tictactoe-reset", ({ lobbyCode }) => {
      io.to(lobbyCode).emit("tictactoe-reset")
    })

    socket.on("disconnect", () => {
      console.log(`🔴 ${socket.id} disconnected`)

      // Remove socket from all lobbies it's in
      for (const [lobbyCode, players] of Object.entries(lobbyPlayers)) {
        const i = players.indexOf(socket.id)
        if (i !== -1) {
          players.splice(i, 1)
          io.to(lobbyCode).emit("userLeft", socket.id)
        }
        // Optionally clean up empty lobbies
        if (players.length === 0) {
          delete lobbyPlayers[lobbyCode]
        }
      }
    })
  })
}
