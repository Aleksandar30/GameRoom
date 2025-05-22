import { Server } from "socket.io"

const gameLobbies: Record<string, string[]> = {}
const ongoingMatches: Record<string, [string, string]> = {}
const socketToUsername: Record<string, string> = {}


export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log(`🟢 ${socket.id} connected`)

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
      let players = gameLobbies[game] || []

      // If the player already got matched and removed, prevent retry
      if (!players.includes(socket.id)) {
        console.log(`⛔ ${socket.id} is not in ${game} lobby anymore.`)
        socket.emit("lobbyChat", {
          user: "System",
          message: "You're already being matched or in a game."
        })
        return
      }

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
          players: [
            { id: socket.id, username: socketToUsername[socket.id] || "Guest" },
            { id: opponent, username: socketToUsername[opponent] || "Guest" }
          ]
        })

        // Remove matched players from the lobby
        gameLobbies[game] = players.filter((id) => id !== socket.id && id !== opponent)
        console.log(`✅ Match created between ${socket.id} and ${opponent}`)
      } else {
        socket.emit("lobbyChat", {
          user: "System",
          message: "Waiting for an opponent..."
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
      delete socketToUsername[socket.id]
    })
  })
}
