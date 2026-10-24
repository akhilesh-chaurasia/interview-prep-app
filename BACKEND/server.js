require("dotenv").config() 
const http = require("http")
const app = require("./src/app") 
const connectToDB = require("./src/config/database")
const env = require("./src/config/env")
const { Server } = require("socket.io")

// Store active rooms (in-memory, for simple use case)
const rooms = new Map()

const start = async () => {
     try { 
        await connectToDB() 

        // Create HTTP server for socket.io
        const server = http.createServer(app)

        // Set up Socket.IO server with proper CORS
        const allowedOrigins = [
          "http://localhost:5173",
          "http://localhost:5174",
          env.FRONTEND_URL
        ].filter(Boolean)

        const io = new Server(server, {
          cors: {
            origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
            methods: ["GET", "POST"],
            credentials: true
          }
        })

        // Handle Socket.IO connections
        io.on("connection", (socket) => {
          console.log("New user connected:", socket.id)

          // Create a room
          socket.on("create-room", (data) => {
            const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
            rooms.set(roomCode, {
              host: data.username,
              hostId: socket.id,
              participants: [data.username],
              messages: [],
              currentQuestion: null
            })
            socket.data.roomCode = roomCode
            socket.data.username = data.username
            socket.join(roomCode)
            socket.emit("room-created", { roomCode })
            console.log(`Room created: ${roomCode} by ${data.username}`)
          })

          // Join a room
          socket.on("join-room", (data) => {
            const room = rooms.get(data.roomCode)
            if (room) {
              if (!room.participants.includes(data.username)) {
                room.participants.push(data.username)
              }
              socket.data.roomCode = data.roomCode
              socket.data.username = data.username
              socket.join(data.roomCode)
              io.to(data.roomCode).emit("user-joined", { 
                username: data.username, 
                participants: room.participants 
              })
              socket.emit("room-joined", { room })
              console.log(`${data.username} joined room ${data.roomCode}`)
            } else {
              socket.emit("room-error", { message: "Room not found!" })
            }
          })

          // Select question (synchronize with peers in the room)
          socket.on("select-question", (data) => {
            const room = rooms.get(data.roomCode)
            if (room) {
              room.currentQuestion = data.question
              io.to(data.roomCode).emit("question-selected", { 
                question: data.question,
                selectedBy: data.username 
              })
            }
          })

          // Send message
          socket.on("send-message", (data) => {
            const room = rooms.get(data.roomCode)
            if (room) {
              const message = {
                username: data.username,
                text: data.text,
                timestamp: new Date()
              }
              room.messages.push(message)
              io.to(data.roomCode).emit("new-message", message)
            }
          })

          // Disconnect & cleanup
          socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id)
            const { roomCode, username } = socket.data || {}
            if (roomCode && rooms.has(roomCode)) {
              const room = rooms.get(roomCode)
              room.participants = room.participants.filter(p => p !== username)
              if (room.participants.length === 0) {
                rooms.delete(roomCode)
                console.log(`Room ${roomCode} cleaned up (empty)`)
              } else {
                io.to(roomCode).emit("user-left", { 
                  username, 
                  participants: room.participants 
                })
              }
            }
          })
        })

        server.listen(env.PORT, () => { 
          console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`) 
        }) 
}
  catch (err) { 
    console.error("Failed to start server:", err)
    process.exit(1)
} 
}
 start()