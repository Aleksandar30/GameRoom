import express from "express"
import http from "http"
import { Server } from "socket.io"
import { AppDataSource } from "./data-source"
import { setupSocket } from "./socket"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth" // 👈 add this line

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })


// ✅ Middlewares
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json()) // required to parse JSON body

// ✅ API routes
app.use("/api", authRoutes)

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Database connected")

    setupSocket(io)

    server.listen(3000, () => {
      console.log("🚀 Server running on http://localhost:3000")
    })
  })
  .catch((error) => console.error("❌ DB Init Error:", error))
